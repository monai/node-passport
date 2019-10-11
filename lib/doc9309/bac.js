const crypto = require('crypto');
const { promisify } = require('util');
const { mac, pad } = require('../iso9797');
const { computeKey } = require('./dbak');
const { CommandAPDU, ResponseAPDU } = require('./apdu');

module.exports = {
  performBac,
  authentication,
  computeSessionKeys,
};

async function performBac(reader, keys) {
  const options = {
    keys,
  };
  let apdu, res;

  apdu = new CommandAPDU(0x00, 0x84, 0x00, 0x00, { le: 0x08 });
  res = await reader.transmit(apdu.toBuffer(), 10);
  options.rndIc = res.slice(0, 8);
  Object.assign(options, await authenticate(options));

  const data = Buffer.concat(options.keysIfd);
  apdu = new CommandAPDU(0x00, 0x82, 0x00, 0x00, { data, le: 0x28 });
  res = await reader.transmit(apdu.toBuffer(), 42);
  options.keysIc = res;

  const [ksEnc, ksMac, ssc] = computeSessionKeys(options);
  return {
    ksEnc,
    ksMac,
    ssc,
  };
}

async function authenticate(bac) {
  const { keys, rndIc } = bac;
  const randomBytes = promisify(crypto.randomBytes);
  const rnd = await randomBytes(24);

  const rndIfd = rnd.slice(0, 8);
  const kIfd = rnd.slice(8, 24);

  const keysIfd = authentication(keys, rndIc, rndIfd, kIfd);
  return {
    rndIfd,
    kIfd,
    keysIfd,
  };
}


function authentication(keys, rndIc, rndIfd, kIfd) {
  const [kEnc, kMac] = keys;
  const s = Buffer.concat([rndIfd, rndIc, kIfd]);

  const eIfd = computeEifd(kEnc, s);
  const mIfd = mac(kMac, pad(eIfd));

  return [eIfd, mIfd];
}

function computeEifd(kEnc, s) {
  const iv = Buffer.alloc(8);
  const key = Buffer.concat([kEnc, kEnc.slice(0, 8)]);

  const cipher = crypto.createCipheriv('des-ede3-cbc', key, iv);
  return cipher.update(s);
}

function computeSessionKeys(options) {
  const { rndIfd, kIfd, rndIc } = options;
  const [enc, mac] = options.keys;
  const [eIfd, mIfd] = options.keysIfd;
  const data = options.keysIc;

  const kEnc = Buffer.concat([enc, enc.slice(0, 8)]);
  const iv = Buffer.alloc(8);
  const decipher = crypto.createDecipheriv('des-ede3-cbc', kEnc, iv);

  const res = decipher.update(data);
  const kIc = res.slice(16, 32);
  const k = xor(kIfd, kIc);

  const c1 = Buffer.from([0, 0, 0, 1]);
  const c2 = Buffer.from([0, 0, 0, 2]);

  const dEnc = Buffer.concat([k, c1]);
  const dMac = Buffer.concat([k, c2]);

  const ksEnc = computeKey(dEnc);
  const ksMac = computeKey(dMac);

  const ssc = Buffer.concat([rndIc.slice(-4), rndIfd.slice(-4)]);

  return [ksEnc, ksMac, ssc];
}

function xor(a, b) {
  const out = Buffer.alloc(a.length);
  for (let i = 0; i < a.length; i++) {
    out[i] = a[i] ^ b[i];
  }
  return out;
}
