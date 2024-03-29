import {
  randomBytes as _randomBytes, createCipheriv, createHash, createDecipheriv,
} from 'crypto';
import { promisify } from 'util';
import { mac, pad } from '../iso9797.mjs';
import ab2aba from '../util/ab2aba.mjs';
import { kdfEnc, kdfMac } from './kdf.mjs';

const algorithm = 'des-ede3-cbc';

export async function authenticate(bac) {
  const { keys, rndIc } = bac;
  const randomBytes = promisify(_randomBytes);
  const rnd = await randomBytes(24);

  const rndIfd = rnd.subarray(0, 8);
  const kIfd = rnd.subarray(8, 24);

  const keysIfd = computeKeysIfd(keys, rndIc, rndIfd, kIfd);
  return {
    rndIfd,
    kIfd,
    keysIfd,
  };
}

export function computeKeysIfd(keys, rndIc, rndIfd, kIfd) {
  const [kEnc, kMac] = keys;
  const s = Buffer.concat([rndIfd, rndIc, kIfd]);

  const eIfd = computeEifd(kEnc, s);
  const mIfd = mac(kMac, pad(8, eIfd));

  return [eIfd, mIfd];
}

export function computeEifd(kEnc, s) {
  const iv = Buffer.alloc(8);
  const key = ab2aba(kEnc);

  const cipher = createCipheriv('des-ede3-cbc', key, iv);
  return cipher.update(s);
}

export function computeBacKeys(mrzInfo) {
  const sha1 = createHash('sha1');
  sha1.update(mrzInfo);
  const h = sha1.digest();
  const kSeed = h.subarray(0, 16);

  const kEnc = kdfEnc(algorithm, kSeed);
  const kMac = kdfMac(algorithm, kSeed);

  return [kEnc, kMac];
}

export function computeSessionKeys(options) {
  const { kIfd, keysIc: data } = options;
  const [enc] = options.keys;

  const kEnc = ab2aba(enc);
  const iv = Buffer.alloc(8);
  const decipher = createDecipheriv('des-ede3-cbc', kEnc, iv);

  const res = decipher.update(data);
  const kIc = res.subarray(16, 32);
  const kSeed = xor(kIfd, kIc);

  const ksEnc = kdfEnc(algorithm, kSeed);
  const ksMac = kdfMac(algorithm, kSeed);

  return [ksEnc, ksMac];
}

export function computeSsc(options) {
  const { rndIfd, rndIc } = options;
  return Buffer.concat([rndIc.slice(-4), rndIfd.slice(-4)]);
}

function xor(a, b) {
  const out = Buffer.alloc(a.length);
  for (let i = 0; i < a.length; i += 1) {
    out[i] = a[i] ^ b[i];
  }
  return out;
}
