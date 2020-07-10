const crypto = require('crypto');
const CommandApdu = require('../iso7816/CommandApdu');
const ResponseApdu = require('../iso7816/ResponseApdu');
const { encode: encodeLength } = require('../asn1/length');
const { mac: computeMac, pad, unpad } = require('../iso9797');
const parse = require('../asn1/parse');

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
  const CC = computeMac(session.ksMac, N);

  const do8e = buildDO8E(CC);
  const data = Buffer.concat([do87, do97, do8e]);

  return new CommandApdu(
    cmdHeader[0],
    cmdHeader[1],
    cmdHeader[2],
    cmdHeader[3],
    {
      data,
      le: 0,
      sm97: CommandApdu.shortSm97,
    },
  );
}

function incrementSsc(session) {
  const tmp = session.ssc.readBigUInt64BE() + 1n;
  const ssc = Buffer.alloc(8);
  ssc.writeBigUInt64BE(tmp);
  session.ssc = ssc;
}

function unprotect(session, rapdu) {
  if (!rapdu.noError()) {
    return rapdu;
  }

  const tags = parse(rapdu.toBuffer()).reduce((acc, tag) => {
    acc[tag.tag.tagNumber] = tag;
    return acc;
  }, {});
  const { 0x87: do87, 0x99: do99, 0x8e: do8e } = tags;

  if (!do99.contents.equals(ResponseApdu.noError)) {
    return new ResponseApdu(do99.contents);
  }

  if (do8e) {
    const CC = do8e.contents;

    incrementSsc(session);
    const K = pad(Buffer.concat([session.ssc, do87.data, do99.data]));
    const CCb = computeMac(session.ksMac, K);

    if (!CC.equals(CCb)) {
      throw new Error('Ivalid checksum for response APDU');
    }
  }

  const data = do87 ? unpadAndDecryptData(session.ksEnc, do87.contents.slice(1)) : Buffer.alloc(0);
  return new ResponseApdu(data, do99.contents);
}

function maskClassAndPad(apdu) {
  return pad(Buffer.from([
    0x0c,
    apdu.ins,
    apdu.p1,
    apdu.p2,
  ]));
}

function buildDO8E(mac) {
  return Buffer.concat([
    Buffer.from([0x8e, mac.length]),
    mac,
  ]);
}

function buildDO87(ksEnc, apdu) {
  const encrypted = padAndEncryptData(ksEnc, apdu.data);

  return Buffer.concat([
    Buffer.from([0x87]),
    encodeLength(encrypted.length + 1),
    Buffer.from([0x01]),
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
