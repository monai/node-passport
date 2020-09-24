/* eslint-disable no-console */
const crypto = require('crypto');
const { gm } = require('pace');

const Reader = require('./lib/reader');
const SimpleReader = require('./lib/simpleReader');
const select = require('./lib/iso7816/select');
const readBinary = require('./lib/iso7816/readBinary');
const CommandApdu = require('./lib/iso7816/CommandApdu');
const ControlParameters = require('./lib/iso7816/ControlParameters');
const deriveKey = require('./lib/liteid/deriveKey');
const { pad, mac } = require('./lib/iso9797');
const { ab2aba, hex2buf } = require('./lib/util');
const { assertSwOk, printResShort } = require('./lib/iso7816/util');

work();
async function work() {
  const reader = new Reader();
  const simpleReader = new SimpleReader(reader);

  try {
    await reader.waitForCard();
    await reader.connect({ share_mode: reader.reader.SCARD_SHARE_SHARED });

    // CIAInfo 5032 12
    // OD      5031 11

    // E828BD080F - 7816
    // D61659903701 - D national
    // 5349474E31 SIGN1 - iso
    // 4352595054 CRYPT - pix
    // 524f4f5400 ROOT\x00
    // 43525950544f3100 CRYPTO1\x00

    // E828BD080F D61659903701 4352595054 - info
    // D61659903701 43525950544f3100 - secure environment

    let res;
    let aid;
    let apdu;
    let data;

    // Get CAN base
    aid = ['D61659903701', '524f4f5400'].join('');
    console.log('select', aid, Buffer.from(aid, 'hex').toString());
    res = await select(simpleReader, 0x04, 0x00, { data: aid, bl: 0xff });
    assertSwOk(res);
    // printResShort(res);

    res = await select(simpleReader, 0x02, 0x04, { data: '0101', bl: 0xff });
    assertSwOk(res);

    const cp = new ControlParameters(res.toBuffer());
    res = await readBinary(simpleReader, 0, cp.fileLength);
    assertSwOk(res);

    const can = res.toBuffer();
    const nonceKey = ab2aba(deriveKey(can, 3));

    aid = ['D61659903701', '43525950544f3100'].join('');
    // aid = ['E828BD080F', 'D61659903701', '4352595054'].join('');
    console.log('select', aid, Buffer.from(aid, 'hex').toString());
    res = await select(simpleReader, 0x04, 0x0c, { data: aid, le: 0x100, bl: 0x1ff });
    assertSwOk(res);
    // printResShort(res);

    // MSE: SET 800a04007f00070202040201830102
    // 7816-4, Table 55
    // 80 (Cryptographic mechanism reference): 04007f00070202040201
    //  '4.0.127.0.7.2.2.4.2.1'
    //   id-PACE-ECDH-GM-3DES-CBC-CBC
    // 83 (Reference): 02
    //   0x01: MRZ
    //   0x02: CAN
    console.log('MSE: SET 800a04007f00070202040201830102');
    apdu = new CommandApdu(0x00, 0x22, 0xc1, 0xa4, { data: '800a04007f00070202040201830102' });
    assertSwOk(res);
    // printBer(apdu.data);

    res = await simpleReader.transmit(apdu);
    assertSwOk(res);

    // Step 1. Encrypted Nonce

    // 0x10 — The command is not the last command of a chain
    // GENERAL AUTHENTICATE
    console.log('GENERAL AUTHENTICATE');
    apdu = new CommandApdu(0x10, 0x86, 0x00, 0x00, { data: '7c00', le: 0x0c });

    // 7C: 80: encrypted nonce
    // 7C 0a
    //   80 08
    //     byte[8]
    res = await simpleReader.transmit(apdu);
    assertSwOk(res);

    const encryptedNonce = res.toBuffer().slice(4);
    const encryptedNoncePad = pad(encryptedNonce);

    const decipher = crypto.createDecipheriv('des-ede3-cbc', nonceKey, Buffer.alloc(8));
    const nonce = decipher.update(encryptedNoncePad);

    const mapKeyPair = crypto.createECDH('prime256v1');
    mapKeyPair.generateKeys();
    const mapPkPcd = mapKeyPair.getPublicKey();
    const mapSkPcd = mapKeyPair.getPrivateKey();

    // Step 2. Map Nonce

    // 7C - Dynamic Authentication Data, 9303-11, G-6
    //   81 - Mapping Data (Challenge)
    //     04 - Uncompressed Point
    //     byte[32] - x-coordinate
    //     byte[32] - y-coordinate
    console.log('-> 7C 81');
    data = Buffer.concat([hex2buf`7c438141`, mapPkPcd]);
    apdu = new CommandApdu(0x10, 0x86, 0x00, 0x00, { le: 0x45, data });

    // 7C: 82: Mapping Data
    res = await simpleReader.transmit(apdu);
    assertSwOk(res);

    const mapPkIc = res.toBuffer().slice(4);
    const generator = await gm.mapP(mapSkPcd, mapPkIc, nonce, 'prime256v1');

    // Step 3. Perform Key Agreement
    const [ephPkPcd, ephSkPcd] = await gm.generateKeysP(generator, 'prime256v1');

    console.log('-> 7C 83');
    data = Buffer.concat([hex2buf`7c438341`, ephPkPcd]);
    apdu = new CommandApdu(0x10, 0x86, 0x00, 0x00, { le: 0x45, data });

    // 7C: 84: Response
    res = await simpleReader.transmit(apdu);
    assertSwOk(res);

    const ephPkIc = res.toBuffer().slice(4);
    if (ephPkIc.equals(ephPkPcd)) {
      throw new Error('PCD and IC ephemeral keys are equal');
    }

    // Perform key agreement
    const ephPcdKeyPair = crypto.createECDH('prime256v1');
    ephPcdKeyPair.setPrivateKey(ephSkPcd);
    const sharedSecret = ephPcdKeyPair.computeSecret(ephPkIc);

    const kEnc = ab2aba(deriveKey(sharedSecret, 1));
    const kMac = deriveKey(sharedSecret, 2);

    // Step 4. Mutual Authentication
    const macHeader = hex2buf`
      7f49 4f
        06 0a
          04007f00070202040201
        86 41
    `;

    const tMsg = Buffer.concat([macHeader, ephPkIc]);
    const tPcd = mac(kMac, pad(tMsg));

    console.log('-> 7C 85');
    data = Buffer.concat([hex2buf`7c0a8508`, tPcd]);
    apdu = new CommandApdu(0x00, 0x86, 0x00, 0x00, { le: 0x0c, data });

    // 7C: 86: Response
    res = await simpleReader.transmit(apdu);
    assertSwOk(res);

    printResShort(res);
  } catch (ex) {
    console.error(ex);
  }
}
