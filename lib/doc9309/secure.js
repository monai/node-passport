const crypto = require('crypto');
const APDU = require('./apdu');
const { mac, pad } = require('../iso9797');

module.exports = {
  protect,
  unprotect,
}

function protect(session, apdu) {
  const cmdHeader = maskClassAndPad(apdu);
  let do87 = Buffer.alloc(0);
  let do97 = Buffer.alloc(0);

  if (apdu.data) {
    do87 = buildD087(session.ksEnc, apdu);
  }

  if (apdu.le) {
    do97 = buildD097(apdu);
  }

  const M = Buffer.concat([cmdHeader, do87, do97]);
  const ssc = BigInt(`0x${session.ssc.toString('hex')}`) + 1n;
  session.ssc = Buffer.from(ssc.toString(16), 'hex');
  const N = pad(Buffer.concat([session.ssc, M]));

  const CC = mac(session.ksMac, N);
  const do8e = buildD08E(CC);
  const data = Buffer.concat([do87, do97, do8e]);

  return new APDU(
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

function unprotect() {

}

function maskClassAndPad(apdu) {
  return pad(Buffer.from([
    0x0c,
    apdu.ins,
    apdu.p1,
    apdu.p2
  ]));
}

function buildD08E(mac) {
  return Buffer.concat([
    Buffer.from([0x8e, mac.length]),
    mac,
  ]);
}

function buildD087(ksEnc, apdu) {
  const encrypted = Buffer.concat([
    Buffer.from([0x01]),
    padAndEncryptData(ksEnc, apdu),
  ]);
  return Buffer.concat([
    Buffer.from([0x87]),
    toASN1Length(encrypted.length),
    encrypted,
  ]);
}

function buildD097(apdu) {
  Buffer.from([0x97, 0x01, apdu.le]);
}

function padAndEncryptData(key, apdu) {
  const paddedData = pad(apdu.data);
  const iv = Buffer.alloc(8);

  key = Buffer.concat([key, key.slice(0, 8)]);
  const cipher = crypto.createCipheriv('des-ede3-cbc', key, iv);
  return cipher.update(paddedData);
}

function toASN1Length(data) {
  if (data <= 0x7f) {
    return Buffer.from([data]);
  } else if (data <= 0xff) {
    return Buffer.from([0x81, data]);
  } else if (data <= 0xffff) {
    return Buffer.from([0x82, data >>> 8, data & 0xff])
  }
}
