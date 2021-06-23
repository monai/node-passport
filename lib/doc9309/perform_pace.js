const crypto = require('crypto');
const { ecdh } = require('@monai/pace');
const CommandApdu = require('../iso7816/command_apdu');
const Session = require('./session');
const { pad, mac } = require('../iso9797');
const deriveKey = require('../liteid/derive_key');
const { assertSwOk } = require('../iso7816/util');
const { ab2aba, hex2buf } = require('../util');

module.exports = performPace;

async function performPace(reader, options) {
  let apdu;
  let res;
  let data;

  const nonceKey = ab2aba(deriveKey(options.can, 3));

  // MSE: SET 800a04007f00070202040201830102
  // 7816-4, Table 55
  // 80 (Cryptographic mechanism reference): 04007f00070202040201
  //  '4.0.127.0.7.2.2.4.2.1'
  //   id-PACE-ECDH-GM-3DES-CBC-CBC
  // 83 (Reference): 02
  //   0x01: MRZ
  //   0x02: CAN
  apdu = new CommandApdu(0x00, 0x22, 0xc1, 0xa4, { data: '800a04007f00070202040201830102' });
  res = await reader.transmit(apdu);
  assertSwOk(res);

  // Step 1. Encrypted Nonce

  // 0x10 — The command is not the last command of a chain
  // GENERAL AUTHENTICATE
  apdu = new CommandApdu(0x10, 0x86, 0x00, 0x00, { data: '7c00', le: 0x0c });

  // 7C: 80: encrypted nonce
  // 7C 0a
  //   80 08
  //     byte[8]
  res = await reader.transmit(apdu);
  assertSwOk(res);

  const encryptedNonce = res.data.slice(4);
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
  data = Buffer.concat([hex2buf`7c438141`, mapPkPcd]);
  apdu = new CommandApdu(0x10, 0x86, 0x00, 0x00, { le: 0x45, data });

  // 7C: 82: Mapping Data
  res = await reader.transmit(apdu);
  assertSwOk(res);

  const mapPkIc = res.data.slice(4);
  const generator = ecdh.gm.map(mapSkPcd, mapPkIc, nonce, 'prime256v1');

  // Step 3. Perform Key Agreement
  const [ephPkPcd, ephSkPcd] = ecdh.gm.generateKeys(generator, 'prime256v1');

  // 7C - Dynamic Authentication Data, 9303-11, G-7
  //   83 - Terminal’s Ephemeral Public Key
  //     04 - Uncompressed Point
  //     byte[32] - x-coordinate
  //     byte[32] - y-coordinate
  data = Buffer.concat([hex2buf`7c438341`, ephPkPcd]);
  apdu = new CommandApdu(0x10, 0x86, 0x00, 0x00, { le: 0x45, data });

  // 7C: 84: Chip’s Ephemeral Public Key
  res = await reader.transmit(apdu);
  assertSwOk(res);

  const ephPkIc = res.data.slice(4);
  if (ephPkIc.equals(ephPkPcd)) {
    throw new Error('PCD and IC ephemeral keys are equal');
  }

  // Perform key agreement
  const ephPcdKeyPair = crypto.createECDH('prime256v1');
  ephPcdKeyPair.setPrivateKey(ephSkPcd);
  const sharedSecret = ephPcdKeyPair.computeSecret(ephPkIc);

  const kEnc = deriveKey(sharedSecret, 1);
  const kMac = deriveKey(sharedSecret, 2);

  // Step 4. Mutual Authentication
  const macHeader = hex2buf`
      7f49 4f
        06 0a
          04007f00070202040201
        86 41
    `;
  const tMsg = Buffer.concat([macHeader, ephPkIc]);
  // Doc 9309-11 4.4.3.4
  const tPcd = mac(kMac, pad(tMsg));

  data = Buffer.concat([hex2buf`7c0a8508`, tPcd]);
  apdu = new CommandApdu(0x00, 0x86, 0x00, 0x00, { le: 0x0c, data });

  // 7C: 86: Response
  res = await reader.transmit(apdu);
  assertSwOk(res);

  return new Session('des-ede3-cbc', kEnc, kMac, Buffer.alloc(8));
}
