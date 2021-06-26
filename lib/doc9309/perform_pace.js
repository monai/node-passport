const crypto = require('crypto');
const { ecdh } = require('@monai/pace');
const CommandApdu = require('../iso7816/command_apdu');
const Session = require('./session');
const { pad, mac } = require('../iso9797');
const { kdf } = require('./kdf');
const { assertSwOk } = require('../iso7816/util');
const { ab2aba, hex2buf } = require('../util');
const tlv = require('../asn1/tlv');
const { encode: encodeOid } = require('../asn1/codecs/object_identifier');

const bsiDe = '0.4.0.127.0.7';
const idPace = '2.2.4';
const dhGm = '1';
const ecdhGm = '2';
const dhIm = '3';
const ecdhIm = '4';
const ecdhCam = '6';
const tDesCbcCbc = '1';
const aesCbcCmac128 = '2';
const aesCbcCmac192 = '3';
const aesCbcCmac256 = '4';

const oidsTemplate = {
  'bsi-de': [bsiDe],
  'id-PACE': [bsiDe, idPace],
  'id-PACE-DH-GM': [bsiDe, idPace, dhGm],
  'id-PACE-DH-GM-3DES-CBC-CBC': [bsiDe, idPace, dhGm, tDesCbcCbc],
  'id-PACE-DH-GM-AES-CBC-CMAC-128': [bsiDe, idPace, dhGm, aesCbcCmac128],
  'id-PACE-DH-GM-AES-CBC-CMAC-192': [bsiDe, idPace, dhGm, aesCbcCmac192],
  'id-PACE-DH-GM-AES-CBC-CMAC-256': [bsiDe, idPace, dhGm, aesCbcCmac256],
  'id-PACE-ECDH-GM': [bsiDe, idPace, ecdhGm],
  'id-PACE-ECDH-GM-3DES-CBC-CBC': [bsiDe, idPace, ecdhGm, tDesCbcCbc],
  'id-PACE-ECDH-GM-AES-CBC-CMAC-128': [bsiDe, idPace, ecdhGm, aesCbcCmac128],
  'id-PACE-ECDH-GM-AES-CBC-CMAC-192': [bsiDe, idPace, ecdhGm, aesCbcCmac192],
  'id-PACE-ECDH-GM-AES-CBC-CMAC-256': [bsiDe, idPace, ecdhGm, aesCbcCmac256],
  'id-PACE-DH-IM': [bsiDe, idPace, dhIm],
  'id-PACE-DH-IM-3DES-CBC-CBC': [bsiDe, idPace, dhIm, tDesCbcCbc],
  'id-PACE-DH-IM-AES-CBC-CMAC-128': [bsiDe, idPace, dhIm, aesCbcCmac128],
  'id-PACE-DH-IM-AES-CBC-CMAC-192': [bsiDe, idPace, dhIm, aesCbcCmac192],
  'id-PACE-DH-IM-AES-CBC-CMAC-256': [bsiDe, idPace, dhIm, aesCbcCmac256],
  'id-PACE-ECDH-IM': [bsiDe, idPace, ecdhIm],
  'id-PACE-ECDH-IM-3DES-CBC-CBC': [bsiDe, idPace, ecdhIm, tDesCbcCbc],
  'id-PACE-ECDH-IM-AES-CBC-CMAC-128': [bsiDe, idPace, ecdhIm, aesCbcCmac128],
  'id-PACE-ECDH-IM-AES-CBC-CMAC-192': [bsiDe, idPace, ecdhIm, aesCbcCmac192],
  'id-PACE-ECDH-IM-AES-CBC-CMAC-256': [bsiDe, idPace, ecdhIm, aesCbcCmac256],
  'id-PACE-ECDH-CAM': [bsiDe, idPace, ecdhCam],
  'id-PACE-ECDH-CAM-AES-CBC-CMAC-128': [bsiDe, idPace, ecdhCam, aesCbcCmac128],
  'id-PACE-ECDH-CAM-AES-CBC-CMAC-192': [bsiDe, idPace, ecdhCam, aesCbcCmac192],
  'id-PACE-ECDH-CAM-AES-CBC-CMAC-256': [bsiDe, idPace, ecdhCam, aesCbcCmac256],
};

const oids = Object.fromEntries(
  Object
    .entries(oidsTemplate)
    .map(([key, val]) => [
      key,
      val.join('.').split('.').map((n) => parseInt(n, 10)),
    ]),
);

const algorithms = {
  1: 'des-ede3-cbc',
  2: 'aes-128-cbc',
  3: 'aes-192-cbc',
  4: 'aes-256-cbc',
};

module.exports = {
  oids,
  algorithms,
  performPace,
};

async function performPace(reader, options) {
  let apdu;
  let res;
  let data;

  let reference;
  if ('mrz' in options) {
    reference = 0x01;
  } else if ('can' in options) {
    reference = 0x02;
  } else {
    throw new TypeError('Key reference is missing');
  }

  // MSE: SET
  // 7816-4, Table 55
  // 80 (Cryptographic mechanism reference): 04007f00070202040201
  //  '0.4.0.127.0.7.2.2.4.2.1'
  //   id-PACE-ECDH-GM-3DES-CBC-CBC
  // 83 (Reference): 02
  //   0x01: MRZ
  //   0x02: CAN

  if (!('oid' in options)) {
    throw new TypeError('Algorithm OID is missing');
  }

  const mechanismDo = tlv(0x80, encodeOid(options.oid));
  const referenceDo = tlv(0x83, Buffer.from([reference]));
  data = Buffer.concat([mechanismDo, referenceDo]);

  apdu = new CommandApdu(0x00, 0x22, 0xc1, 0xa4, { data });
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

  const algorithm = algorithms[options.oid[options.oid.length - 1]];
  let nonceKey = kdf(options.can, 3, algorithm);
  if (algorithm === algorithms[1]) {
    nonceKey = ab2aba(nonceKey);
  }

  const decipher = crypto.createDecipheriv(algorithm, nonceKey, Buffer.alloc(8));
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

  const kEnc = kdf(sharedSecret, 1, algorithm);
  const kMac = kdf(sharedSecret, 2, algorithm);

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

  return new Session(algorithm, kEnc, kMac, Buffer.alloc(8));
}
