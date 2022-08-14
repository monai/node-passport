import { createDiffieHellman, createECDH, createDecipheriv } from 'crypto';
import { aesCmac } from 'node-aes-cmac';
import pace from '@monai/pace-v2';
import CommandApdu from '../iso7816/command_apdu.mjs';
import Session from './session.mjs';
import { pad, mac } from '../iso9797.mjs';
import { kdf } from './kdf.mjs';
import { assertSwOk } from '../iso7816/util.mjs';
import ab2aba from '../util/ab2aba.mjs';
import hex from '../util/hex.mjs';
import tlv from '../asn1/tlv.mjs';
import { encode as encodeOid } from '../asn1/codecs/object_identifier.mjs';

const bsiDe = [0, 4, 0, 127, 0, 7];
const idPace = [2, 2, 4];
const idPasswordType = [2, 2, 12];
const dhGm = 1;
const ecdhGm = 2;
const dhIm = 3;
const ecdhIm = 4;
const ecdhCam = 6;
const tDesCbcCbc = 1;
const aesCbcCmac128 = 2;
const aesCbcCmac192 = 3;
const aesCbcCmac256 = 4;
const idMrz = 1;
const idCan = 2;
const idPin = 3;
const idPuk = 4;

const bsiDeIdentifier = 'bsi-de';
const idPaceIdentifier = 'id-PACE';
const idPasswordTypeIdentifier = 'id-PasswordType';
const dh = 'DH';
const ecdh = 'ECDH';

const standardizedDomainParameters = {
  0: {
    prime: hex`
        B10B8F96 A080E01D DE92DE5E AE5D54EC 52C99FBC FB06A3C6
        9A6A9DCA 52D23B61 6073E286 75A23D18 9838EF1E 2EE652C0
        13ECB4AE A9061123 24975C3C D49B83BF ACCBDD7D 90C4BD70
        98488E9C 219A7372 4EFFD6FA E5644738 FAA31A4F F55BCCC0
        A151AF5F 0DC8B4BD 45BF37DF 365C1A65 E68CFDA7 6D4DA708
        DF1FB2BC 2E4A4371
    `,
    generator: hex`
        A4D1CBD5 C3FD3412 6765A442 EFB99905 F8104DD2 58AC507F
        D6406CFF 14266D31 266FEA1E 5C41564B 777E690F 5504F213
        160217B4 B01B886A 5E91547F 9E2749F4 D7FBD7D3 B9A92EE1
        909D0D22 63F80A76 A6A24C08 7A091F53 1DBF0A01 69B6A28A
        D662A4D1 8E73AFA3 2D779D59 18D08BC8 858F4DCE F97C2A24
        855E6EEB 22B3B2E5
    `,
  },
  1: {
    prime: hex`
        AD107E1E 9123A9D0 D660FAA7 9559C51F A20D64E5 683B9FD1
        B54B1597 B61D0A75 E6FA141D F95A56DB AF9A3C40 7BA1DF15
        EB3D688A 309C180E 1DE6B85A 1274A0A6 6D3F8152 AD6AC212
        9037C9ED EFDA4DF8 D91E8FEF 55B7394B 7AD5B7D0 B6C12207
        C9F98D11 ED34DBF6 C6BA0B2C 8BBC27BE 6A00E0A0 B9C49708
        B3BF8A31 70918836 81286130 BC8985DB 1602E714 415D9330
        278273C7 DE31EFDC 7310F712 1FD5A074 15987D9A DC0A486D
        CDF93ACC 44328387 315D75E1 98C641A4 80CD86A1 B9E587E8
        BE60E69C C928B2B9 C52172E4 13042E9B 23F10B0E 16E79763
        C9B53DCF 4BA80A29 E3FB73C1 6B8E75B9 7EF363E2 FFA31F71
        CF9DE538 4E71B81C 0AC4DFFE 0C10E64F
    `,
    generator: hex`
        AC4032EF 4F2D9AE3 9DF30B5C 8FFDAC50 6CDEBE7B 89998CAF
        74866A08 CFE4FFE3 A6824A4E 10B9A6F0 DD921F01 A70C4AFA
        AB739D77 00C29F52 C57DB17C 620A8652 BE5E9001 A8D66AD7
        C1766910 1999024A F4D02727 5AC1348B B8A762D0 521BC98A
        E2471504 22EA1ED4 09939D54 DA7460CD B5F6C6B2 50717CBE
        F180EB34 118E98D1 19529A45 D6F83456 6E3025E3 16A330EF
        BB77A86F 0C1AB15B 051AE3D4 28C8F8AC B70A8137 150B8EEB
        10E183ED D19963DD D9E263E4 770589EF 6AA21E7F 5F2FF381
        B539CCE3 409D13CD 566AFBB4 8D6C0191 81E1BCFE 94B30269
        EDFE72FE 9B6AA4BD 7B5A0F1C 71CFFF4C 19C418E1 F6EC0179
        81BC087F 2A7065B3 84B890D3 191F2BFA
    `,
  },
  2: {
    prime: hex`
        87A8E61D B4B6663C FFBBD19C 65195999 8CEEF608 660DD0F2
        5D2CEED4 435E3B00 E00DF8F1 D61957D4 FAF7DF45 61B2AA30
        16C3D911 34096FAA 3BF4296D 830E9A7C 209E0C64 97517ABD
        5A8A9D30 6BCF67ED 91F9E672 5B4758C0 22E0B1EF 4275BF7B
        6C5BFC11 D45F9088 B941F54E B1E59BB8 BC39A0BF 12307F5C
        4FDB70C5 81B23F76 B63ACAE1 CAA6B790 2D525267 35488A0E
        F13C6D9A 51BFA4AB 3AD83477 96524D8E F6A167B5 A41825D9
        67E144E5 14056425 1CCACB83 E6B486F6 B3CA3F79 71506026
        C0B857F6 89962856 DED4010A BD0BE621 C3A3960A 54E710C3
        75F26375 D7014103 A4B54330 C198AF12 6116D227 6E11715F
        693877FA D7EF09CA DB094AE9 1E1A1597
    `,
    generator: hex`
        3FB32C9B 73134D0B 2E775066 60EDBD48 4CA7B18F 21EF2054
        07F4793A 1A0BA125 10DBC150 77BE463F FF4FED4A AC0BB555
        BE3A6C1B 0C6B47B1 BC3773BF 7E8C6F62 901228F8 C28CBB18
        A55AE313 41000A65 0196F931 C77A57F2 DDF463E5 E9EC144B
        777DE62A AAB8A862 8AC376D2 82D6ED38 64E67982 428EBC83
        1D14348F 6F2F9193 B5045AF2 767164E1 DFC967C1 FB3F2E55
        A4BD1BFF E83B9C80 D052B985 D182EA0A DB2A3B73 13D3FE14
        C8484B1E 052588B9 B7D2BBD2 DF016199 ECD06E15 57CD0915
        B3353BBB 64E0EC37 7FD02837 0DF92B52 C7891428 CDC67EB6
        184B523D 1DB246C3 2F630784 90F00EF8 D647D148 D4795451
        5E2327CF EF98C582 664B4C0F 6CC41659
    `,
  },
  8: {
    curve: 'prime192v1', // secp192r1
  },
  9: {
    curve: 'brainpoolP192r1',
  },
  10: {
    curve: 'secp224r1',
    noIm: true,
  },
  11: {
    curve: 'brainpoolP224r1',
  },
  12: {
    curve: 'prime256v1', // secp256r1
  },
  13: {
    curve: 'brainpoolP256r1',
  },
  14: {
    curve: 'brainpoolP320r1',
  },
  15: {
    curve: 'secp384r1',
  },
  16: {
    curve: 'brainpoolP384r1',
  },
  17: {
    curve: 'brainpoolP512r1',
  },
  18: {
    curve: 'secp521r1',
  },
};

const keyAgreements = {
  [dh]: {
    mutualAuthenticationDo: 0x84,
    createKeyPair({ prime, generator }) {
      return createDiffieHellman(prime, generator);
    },
  },
  [ecdh]: {
    mutualAuthenticationDo: 0x86,
    createKeyPair({ curve }) {
      return createECDH(curve);
    },
  },
};

export const mappings = {
  [dhGm]: {
    arc: dhGm,
    keyAgreement: dh,
    identifier: 'DH-GM',
    map: notImplemented,
    generateKeys: notImplemented,
  },
  [ecdhGm]: {
    arc: ecdhGm,
    keyAgreement: ecdh,
    identifier: 'ECDH-GM',
    map: pace.ecdh.gm.map,
    generateKeys: pace.ecdh.gm.generateKeys,
  },
  [dhIm]: {
    arc: dhIm,
    keyAgreement: dh,
    identifier: 'DH-IM',
    map: notImplemented,
    generateKeys: notImplemented,
  },
  [ecdhIm]: {
    arc: ecdhIm,
    keyAgreement: ecdh,
    identifier: 'ECDH-IM',
    map: notImplemented,
    generateKeys: notImplemented,
  },
  [ecdhCam]: {
    arc: ecdhCam,
    keyAgreement: ecdh,
    identifier: 'ECDH-CAM',
    map: notImplemented,
    generateKeys: notImplemented,
  },
};

export const algorithms = {
  [tDesCbcCbc]: {
    arc: tDesCbcCbc,
    identifier: '3DES-CBC-CBC',
    algorithm: 'des-ede3-cbc',
    blockSize: 8,
    adjustKey: (key) => ab2aba(key),
    mac: (key, data) => mac(key, pad(8, data)),
  },
  [aesCbcCmac128]: {
    arc: aesCbcCmac128,
    identifier: 'AES-CBC-CMAC-128',
    algorithm: 'aes-128-cbc',
    blockSize: 16,
    mac: cmac,
  },
  [aesCbcCmac192]: {
    arc: aesCbcCmac192,
    identifier: 'AES-CBC-CMAC-192',
    algorithm: 'aes-192-cbc',
    blockSize: 16,
    mac: cmac,
  },
  [aesCbcCmac256]: {
    arc: aesCbcCmac256,
    identifier: 'AES-CBC-CMAC-256',
    algorithm: 'aes-256-cbc',
    blockSize: 16,
    mac: cmac,
  },
};

export const passwordTypes = {
  [idMrz]: {
    identifier: 'id-MRZ',
  },
  [idCan]: {
    identifier: 'id-CAN',
  },
  [idPin]: {
    identifier: 'id-PIN',
  },
  [idPuk]: {
    identifier: 'id-PUK',
  },
};

const conf = Object.keys(mappings).reduce((acc, mapping) => {
  mapping = mappings[mapping];
  const mapOid = [...bsiDe, ...idPace, mapping.arc];
  const mappingInfo = {
    oid: mapOid,
    ...mapping,
    mappingIdentifier: mapping.identifier,
    identifier: [idPaceIdentifier, mapping.identifier].join('-'),
  };
  acc[mapOid.join('.')] = mappingInfo;

  Object.keys(algorithms).forEach((algorithm) => {
    algorithm = algorithms[algorithm];
    const algOid = [...mapOid, algorithm.arc];
    acc[algOid.join('.')] = {
      ...mappingInfo,
      oid: algOid,
      ...algorithm,
      ...keyAgreements[mapping.keyAgreement],
      algorithmIdentifier: algorithm.identifier,
      identifier: [idPaceIdentifier, mapping.identifier, algorithm.identifier].join('-'),
    };
  });

  for (const [arc, passwordType] of Object.entries(passwordTypes)) {
    const oid = [...bsiDe, ...idPasswordType, arc];
    acc[oid.join('.')] = {
      oid,
      arc,
      ...passwordType,
    };
  }

  return acc;
}, {});

export const oids = Object.fromEntries(
  Object.entries(conf).map(([oid, obj]) => [obj.identifier, oid]),
);
oids[bsiDeIdentifier] = bsiDe.join('.');
oids[idPaceIdentifier] = idPace.join('.');
oids[idPasswordTypeIdentifier] = [...bsiDe, ...idPasswordType].join('.');
oids.standardizedDomainParameters = [...bsiDe, 1, 2].join('.');

export async function performPace(reader, options) {
  let apdu;
  let res;
  let data;

  if (!('protocol' in options)) {
    throw new TypeError('Protocol is missing');
  }

  const currentConf = {
    ...conf[oids[options.protocol]],
    ...standardizedDomainParameters[options.standardizedDomainParametersId],
  };
  const reference = conf[oids[options.reference]].arc;

  const imIdentifiers = [dhIm, ecdhIm].map((id) => mappings[id].identifier);
  if (currentConf.noIm && imIdentifiers.includes(currentConf.mappingIdentifier)) {
    const { curve } = standardizedDomainParameters[options.standardizedDomainParametersId];
    throw new Error(`Curve ${curve} cannot be used with the Integrated Mapping`);
  }

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
  apdu = new CommandApdu(0x10, 0x86, 0x00, 0x00, { data, le: currentConf.blockSize + 4 });

  // 7C: 80: Encrypted Nonce
  res = await reader.transmit(apdu);
  assertSwOk(res);

  const encryptedNonce = res.data.slice(4);
  const encryptedNoncePad = pad(currentConf.blockSize, encryptedNonce);

  let nonceKey = kdf(options.password, 3, currentConf.algorithm);
  nonceKey = currentConf.adjustKey?.(nonceKey) ?? nonceKey;

  const decipher = createDecipheriv(
    currentConf.algorithm,
    nonceKey,
    Buffer.alloc(currentConf.blockSize),
  );
  const nonce = decipher.update(encryptedNoncePad);

  const mapKeyPair = currentConf.createKeyPair(currentConf);
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
  const generator = currentConf.map(mapSkPcd, mapPkIc, nonce, currentConf.curve);
  const [ephPkPcd, ephSkPcd] = currentConf.generateKeys(generator, currentConf.curve);

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
  const ephPcdKeyPair = currentConf.createKeyPair(currentConf);
  ephPcdKeyPair.setPrivateKey(ephSkPcd);
  const sharedSecret = ephPcdKeyPair.computeSecret(ephPkIc);

  const kEnc = kdf(sharedSecret, 1, currentConf.algorithm);
  const kMac = kdf(sharedSecret, 2, currentConf.algorithm);

  // Step 4. Mutual Authentication
  // Doc 9309-11 4.4.3.4

  // 7C: 85: Authentication Token
  const oidDo = tlv(0x06, encodedOid);
  const ephPkIcDo = tlv(currentConf.mutualAuthenticationDo, ephPkIc);
  const tMsg = tlv(0x7f49, Buffer.concat([oidDo, ephPkIcDo]));
  const tPcd = currentConf.mac(kMac, tMsg).slice(0, 8);
  const tPcdDo = tlv(0x85, tPcd);
  data = tlv(0x7c, tPcdDo);
  apdu = new CommandApdu(0x00, 0x86, 0x00, 0x00, { data, le: 0x0c });

  // 7C: 86: Authentication Token
  res = await reader.transmit(apdu);
  assertSwOk(res);

  const tIc = res.data.slice(4);
  if (tPcd.equals(tIc)) {
    throw new Error('PCD and IC authentication tokens are equal');
  }

  return new Session(currentConf.algorithm, kEnc, kMac);
}

function notImplemented() {
  throw new Error('Not implemented');
}

function cmac(key, data) {
  return aesCmac(key, data, { returnAsBuffer: true });
}
