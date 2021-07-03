const crypto = require('crypto');
const pace = require('@monai/pace');
const CommandApdu = require('../iso7816/command_apdu');
const Session = require('./session');
const { pad, mac } = require('../iso9797');
const { kdf } = require('./kdf');
const { assertSwOk } = require('../iso7816/util');
const { ab2aba } = require('../util');
const tlv = require('../asn1/tlv');
const { encode: encodeOid } = require('../asn1/codecs/object_identifier');

const bsiDe = [0, 4, 0, 127, 0, 7];
const idPace = [2, 2, 4];
const dhGm = 1;
const ecdhGm = 2;
const dhIm = 3;
const ecdhIm = 4;
const ecdhCam = 6;
const tDesCbcCbc = 1;
const aesCbcCmac128 = 2;
const aesCbcCmac192 = 3;
const aesCbcCmac256 = 4;

const bsiDeIdentifier = 'bsi-de';
const idPaceIdentifier = 'id-PACE';
const dh = 'DH';
const ecdh = 'ECDH';

const mutualAuthenticationDos = {
  [dh]: 0x84,
  [ecdh]: 0x86,
};

const protocols = {
  [dhGm]: {
    arc: dhGm,
    type: dh,
    identifier: 'DH-GM',
    map: notImplemented,
    generateKeys: notImplemented,
  },
  [ecdhGm]: {
    arc: ecdhGm,
    type: ecdh,
    identifier: 'ECDH-GM',
    map: pace.ecdh.gm.map,
    generateKeys: pace.ecdh.gm.generateKeys,
  },
  [dhIm]: {
    arc: dhIm,
    type: dh,
    identifier: 'DH-IM',
    map: notImplemented,
    generateKeys: notImplemented,
  },
  [ecdhIm]: {
    arc: ecdhIm,
    type: ecdh,
    identifier: 'ECDH-IM',
    map: notImplemented,
    generateKeys: notImplemented,
  },
  [ecdhCam]: {
    arc: ecdhCam,
    type: ecdh,
    identifier: 'ECDH-CAM',
    map: notImplemented,
    generateKeys: notImplemented,
  },
};

const algorithms = {
  [tDesCbcCbc]: {
    arc: tDesCbcCbc,
    identifier: '3DES-CBC-CBC',
    algorithm: 'des-ede3-cbc',
    adjustKey: (key) => ab2aba(key),
  },
  [aesCbcCmac128]: {
    arc: aesCbcCmac128,
    identifier: 'AES-CBC-CMAC-128',
    algorithm: 'aes-128-cbc',
  },
  [aesCbcCmac192]: {
    arc: aesCbcCmac192,
    identifier: 'AES-CBC-CMAC-192',
    algorithm: 'aes-192-cbc',
  },
  [aesCbcCmac256]: {
    arc: aesCbcCmac256,
    identifier: 'AES-CBC-CMAC-256',
    algorithm: 'aes-256-cbc',
  },
};

const conf = Object.keys(protocols).reduce((acc, protocol) => {
  protocol = protocols[protocol];
  const mapOid = [...bsiDe, ...idPace, protocol.arc];
  acc[mapOid.join('.')] = {
    oid: mapOid,
    ...protocol,
    identifier: [idPaceIdentifier, protocol.identifier].join('-'),
  };

  Object.keys(algorithms).forEach((algorithm) => {
    algorithm = algorithms[algorithm];
    const algOid = [...mapOid, algorithm.arc];
    acc[algOid.join('.')] = {
      oid: algOid,
      ...protocol,
      ...algorithm,
      identifier: [idPaceIdentifier, protocol.identifier, algorithm.identifier].join('-'),
    };
  });

  return acc;
}, {});

const oids = Object.fromEntries(Object.entries(conf).map(([oid, obj]) => [obj.identifier, oid]));
oids[bsiDeIdentifier] = bsiDe.join('.');
oids[idPaceIdentifier] = idPace.join('.');

module.exports = {
  oids,
  protocols,
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

  if (!('oid' in options)) {
    throw new TypeError('Algorithm OID is missing');
  }

  const currentConf = conf[options.oid];

  // MSE: SET
  // 7816-4, Table 55
  // 80 (Cryptographic mechanism reference):
  //   Mechanism OID
  // 83 (Reference):
  //   0x01: MRZ
  //   0x02: CAN
  const encodedOid = encodeOid(currentConf.oid);
  const mechanismDo = tlv(0x80, encodedOid);
  const referenceDo = tlv(0x83, Buffer.from([reference]));
  data = Buffer.concat([mechanismDo, referenceDo]);
  apdu = new CommandApdu(0x00, 0x22, 0xc1, 0xa4, { data });
  res = await reader.transmit(apdu);
  assertSwOk(res);

  // Step 1. Encrypted Nonce

  // 0x10 — The command is not the last command of a chain
  // GENERAL AUTHENTICATE
  data = tlv(0x7c);
  apdu = new CommandApdu(0x10, 0x86, 0x00, 0x00, { data, le: 0x0c });

  // 7C: 80: Encrypted Nonce
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

  // 7C: 81: Mapping Data
  const mapPkPcdDo = tlv(0x81, mapPkPcd);
  data = tlv(0x7c, mapPkPcdDo);
  apdu = new CommandApdu(0x10, 0x86, 0x00, 0x00, { data, le: 0x45 });

  // 7C: 82: Mapping Data
  res = await reader.transmit(apdu);
  assertSwOk(res);

  const mapPkIc = res.data.slice(4);
  const generator = currentConf.map(mapSkPcd, mapPkIc, nonce, options.curve);
  const [ephPkPcd, ephSkPcd] = currentConf.generateKeys(generator, options.curve);

  // Step 3. Perform Key Agreement

  // 7C: 83: Terminal’s Ephemeral Public Key
  const ephPkPcdDo = tlv(0x83, ephPkPcd);
  data = tlv(0x7c, ephPkPcdDo);
  apdu = new CommandApdu(0x10, 0x86, 0x00, 0x00, { data, le: 0x45 });

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
  // Doc 9309-11 4.4.3.4

  // 7C: 85: Authentication Token
  const oidDo = tlv(0x06, encodedOid);
  const ephPkIcDo = tlv(mutualAuthenticationDos[currentConf.type], ephPkIc);
  const tMsg = tlv(0x7f49, Buffer.concat([oidDo, ephPkIcDo]));
  const tPcd = mac(kMac, pad(tMsg));
  const tPcdDo = tlv(0x85, tPcd);
  data = tlv(0x7c, tPcdDo);
  apdu = new CommandApdu(0x00, 0x86, 0x00, 0x00, { le: 0x0c, data });

  // 7C: 86: Authentication Token
  res = await reader.transmit(apdu);
  assertSwOk(res);

  return new Session(currentConf.algorithm, kEnc, kMac, Buffer.alloc(8));
}

function notImplemented() {
  throw new Error('Not implemented');
}
