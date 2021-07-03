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

const bsiDe = [0, 4, 0, 127, 0, 7];
const idPace = [2, 2, 4];
const dhGm = [1];
const ecdhGm = [2];
const dhIm = [3];
const ecdhIm = [4];
const ecdhCam = [6];
const tDesCbcCbc = [1];
const aesCbcCmac128 = [2];
const aesCbcCmac192 = [3];
const aesCbcCmac256 = [4];

const bsiDeTitle = 'bsi-de';
const idPaceTitle = 'id-PACE';

const mappings = {
  [dhGm]: {
    title: 'DH-GM',
    map: notImplemented,
    generateKeys: notImplemented,
  },
  [ecdhGm]: {
    title: 'ECDH-GM',
    map: ecdh.gm.map,
    generateKeys: ecdh.gm.generateKeys,
  },
  [dhIm]: {
    title: 'DH-IM',
    map: notImplemented,
    generateKeys: notImplemented,
  },
  [ecdhIm]: {
    title: 'ECDH-IM',
    map: notImplemented,
    generateKeys: notImplemented,
  },
  [ecdhCam]: {
    title: 'ECDH-CAM',
    map: notImplemented,
    generateKeys: notImplemented,
  },
};

const algorithms = {
  [tDesCbcCbc]: {
    title: '3DES-CBC-CBC',
    algorithm: 'des-ede3-cbc',
    adjustKey: (key) => ab2aba(key),
  },
  [aesCbcCmac128]: {
    title: 'AES-CBC-CMAC-128',
    algorithm: 'aes-128-cbc',
  },
  [aesCbcCmac192]: {
    title: 'AES-CBC-CMAC-192',
    algorithm: 'aes-192-cbc',
  },
  [aesCbcCmac256]: {
    title: 'AES-CBC-CMAC-256',
    algorithm: 'aes-256-cbc',
  },
};

const conf = Object.keys(mappings).reduce((acc, mapping) => {
  const mapOid = [...bsiDe, ...idPace, mapping];
  mapping = mappings[mapping];
  acc[mapOid.join('.')] = {
    oid: mapOid,
    ...mapping,
    title: [idPaceTitle, mapping.title].join('-'),
  };

  Object.keys(algorithms).forEach((algorithm) => {
    const algOid = [...mapOid, algorithm];
    algorithm = algorithms[algorithm];
    acc[algOid.join('.')] = {
      oid: algOid,
      ...mapping,
      ...algorithm,
      title: [idPaceTitle, mapping.title, algorithm.title].join('-'),
    };
  });

  return acc;
}, {});

const oids = Object.fromEntries(Object.entries(conf).map(([oid, obj]) => [obj.title, oid]));
oids[bsiDeTitle] = bsiDe.join('.');
oids[idPaceTitle] = idPace.join('.');

module.exports = {
  oids,
  mappings,
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

  const currentConf = conf[options.oid];

  const mechanismDo = tlv(0x80, encodeOid(currentConf.oid));
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

  let nonceKey = kdf(options.can, 3, currentConf.algorithm);
  nonceKey = currentConf?.adjustKey(nonceKey) ?? nonceKey;

  const decipher = crypto.createDecipheriv(currentConf.algorithm, nonceKey, Buffer.alloc(8));
  const nonce = decipher.update(encryptedNoncePad);

  const mapKeyPair = crypto.createECDH(options.curve);
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
  const generator = ecdh.gm.map(mapSkPcd, mapPkIc, nonce, options.curve);

  // Step 3. Perform Key Agreement
  const [ephPkPcd, ephSkPcd] = ecdh.gm.generateKeys(generator, options.curve);

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
  const ephPcdKeyPair = crypto.createECDH(options.curve);
  ephPcdKeyPair.setPrivateKey(ephSkPcd);
  const sharedSecret = ephPcdKeyPair.computeSecret(ephPkIc);

  const kEnc = kdf(sharedSecret, 1, currentConf.algorithm);
  const kMac = kdf(sharedSecret, 2, currentConf.algorithm);

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

  return new Session(currentConf.algorithm, kEnc, kMac, Buffer.alloc(8));
}

function notImplemented() {
  throw new Error('Not implemented');
}
