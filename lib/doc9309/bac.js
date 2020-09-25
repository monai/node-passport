const crypto = require('crypto');
const { promisify } = require('util');
const { mac, pad } = require('../iso9797');
const { ab2aba } = require('../util');
const { kdf } = require('./kdf');

module.exports = {
  authenticate,
  computeEifd,
  computeKeysIfd,
  computeBacKeys,
  computeSessionKeys,
};

const kdftd = (k, c) => kdf(k, c, 'des-ede3-cbc');

async function authenticate(bac) {
  const { keys, rndIc } = bac;
  const randomBytes = promisify(crypto.randomBytes);
  const rnd = await randomBytes(24);

  const rndIfd = rnd.slice(0, 8);
  const kIfd = rnd.slice(8, 24);

  const keysIfd = computeKeysIfd(keys, rndIc, rndIfd, kIfd);
  return {
    rndIfd,
    kIfd,
    keysIfd,
  };
}

function computeKeysIfd(keys, rndIc, rndIfd, kIfd) {
  const [kEnc, kMac] = keys;
  const s = Buffer.concat([rndIfd, rndIc, kIfd]);

  const eIfd = computeEifd(kEnc, s);
  const mIfd = mac(kMac, pad(eIfd));

  return [eIfd, mIfd];
}

function computeEifd(kEnc, s) {
  const iv = Buffer.alloc(8);
  const key = ab2aba(kEnc);

  const cipher = crypto.createCipheriv('des-ede3-cbc', key, iv);
  return cipher.update(s);
}

function computeBacKeys(mrzInfo) {
  const sha1 = crypto.createHash('sha1');
  sha1.update(mrzInfo);
  const h = sha1.digest();
  const kSeed = h.slice(0, 16);

  const kEnc = kdftd(kSeed, 1);
  const kMac = kdftd(kSeed, 2);

  return [kEnc, kMac];
}

function computeSessionKeys(options) {
  const { rndIfd, kIfd, rndIc } = options;
  const [enc] = options.keys;
  const data = options.keysIc;

  const kEnc = ab2aba(enc);
  const iv = Buffer.alloc(8);
  const decipher = crypto.createDecipheriv('des-ede3-cbc', kEnc, iv);

  const res = decipher.update(data);
  const kIc = res.slice(16, 32);
  const kSeed = xor(kIfd, kIc);

  const ksEnc = kdftd(kSeed, 1);
  const ksMac = kdftd(kSeed, 2);

  const ssc = Buffer.concat([rndIc.slice(-4), rndIfd.slice(-4)]);

  return [ksEnc, ksMac, ssc];
}

function xor(a, b) {
  const out = Buffer.alloc(a.length);
  for (let i = 0; i < a.length; i += 1) {
    out[i] = a[i] ^ b[i];
  }
  return out;
}
