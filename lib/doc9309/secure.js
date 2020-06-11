const crypto = require('crypto');
const CommandApdu = require('../iso7816/CommandApdu');
const ResponseApdu = require('../iso7816/ResponseApdu');
const { encode: encodeLength, decode: decodeLength } = require('../asn1/length');
const { mac, pad, unpad } = require('../iso9797');

module.exports = {
  protect,
  unprotect,
};

function protect(session, apdu) {
  const cmdHeader = maskClassAndPad(apdu);
  let do87 = Buffer.alloc(0);
  let do97 = Buffer.alloc(0);

  if (apdu.data) {
    do87 = buildDO87(session.ksEnc, apdu);
  }

  if (apdu.le) {
    do97 = buildDO97(apdu);
  }

  const M = Buffer.concat([cmdHeader, do87, do97]);
  incrementSsc(session);
  const N = pad(Buffer.concat([session.ssc, M]));
  const CC = mac(session.ksMac, N);

  const do8e = buildDO8E(CC);
  const data = Buffer.concat([do87, do97, do8e]);

  return new CommandApdu(
    cmdHeader[0],
    cmdHeader[1],
    cmdHeader[2],
    cmdHeader[3],
    {
      data,
      le: 0
    }
  );
}

function incrementSsc(session) {
  const tmp = session.ssc.readBigUInt64BE() + 1n;
  const ssc = Buffer.alloc(8);
  ssc.writeBigUInt64BE(tmp);
  session.ssc = ssc;
}

function unprotect(session, rapdu) {
  if ( ! rapdu.noError()) {
    return rapdu;
  }

  let do87 = Buffer.alloc(0);
  let do87Data = null;
  let do99 = Buffer.alloc(0);
  let do8e = null;
  let needCC = false;
  let offset = 0;

  if (rapdu.data[0] === 0x87) {
    const [encDataLength, o] = decodeLength(rapdu.data.slice(1));
    offset = 1 + o;

    if (rapdu.data[offset] !== 0x01) {
      throw new Error(`DO'87 is malformed`);
    }

    do87 = rapdu.data.slice(0, offset + encDataLength);
    do87Data = rapdu.data.slice(offset + 1, offset + encDataLength);
    offset += encDataLength;
    needCC = true;
  }

  do99 = rapdu.data.slice(offset, offset + 4);
  const sw1 = rapdu.data.slice(offset + 2, offset + 3);
  const sw2 = rapdu.data.slice(offset + 3, offset + 4);
  offset += 4;
  needCC = true;

  const do99Header = Buffer.from([0x99, 0x02]);
  if ( ! do99.slice(0, 2).equals(do99Header)) {
    return new ResponseApdu(Buffer.from([sw1, sw2]));
  }

  if (rapdu.data[offset] === 0x8e) {
    const ccLength = rapdu.data[offset + 1];
    const CC = rapdu.data.slice(offset + 2, offset + 2 + ccLength);

    incrementSsc(session);
    const K = pad(Buffer.concat([session.ssc, do87, do99]));
    const CCb = mac(session.ksMac, K);

    if ( ! CC.equals(CCb)) {
      throw new Error('Ivalid checksum for RAPDU');
    }
  } else if (needCC) {
    throw new Error(`Mandatory id DO'87' and/or DO'99' is present`);
  }

  const data = do87Data ? unpadAndDecryptData(session.ksEnc, do87Data) : Buffer.alloc(0);
  return new ResponseApdu(data, sw1, sw2);
}

function maskClassAndPad(apdu) {
  return pad(Buffer.from([
    0x0c,
    apdu.ins,
    apdu.p1,
    apdu.p2
  ]));
}

function buildDO8E(mac) {
  return Buffer.concat([
    Buffer.from([0x8e, mac.length]),
    mac,
  ]);
}

function buildDO87(ksEnc, apdu) {
  const encrypted = Buffer.concat([
    Buffer.from([0x01]),
    padAndEncryptData(ksEnc, apdu.data),
  ]);
  return Buffer.concat([
    Buffer.from([0x87]),
    encodeLength(encrypted.length),
    encrypted,
  ]);
}

function buildDO97(apdu) {
  return Buffer.from([0x97, 0x01, apdu.le]);
}

function padAndEncryptData(key, data) {
  const paddedData = pad(data);
  const iv = Buffer.alloc(8);

  key = Buffer.concat([key, key.slice(0, 8)]);
  const cipher = crypto.createCipheriv('des-ede3-cbc', key, iv);
  return cipher.update(paddedData);
}

function unpadAndDecryptData(key, data) {
  const iv = Buffer.alloc(8);

  key = Buffer.concat([key, key.slice(0, 8)]);
  const decipher = crypto.createDecipheriv('des-ede3-cbc', key, iv);
  decipher.setAutoPadding(false);
  return unpad(decipher.update(data));
}
