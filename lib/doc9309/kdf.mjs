import { createHash } from 'crypto';

// Doc 9309-11 9.7.1.1, 9.7.1.2
export const algorithms = {
  'des-ede3-cbc': {
    hash: 'sha1',
    length: 16,
  },
  'aes-128-cbc': {
    hash: 'sha1',
    length: 16,
  },
  'aes-192-cbc': {
    hash: 'sha256',
    length: 24,
  },
  'aes-256-cbc': {
    hash: 'sha256',
    length: 32,
  },
};

export function kdfEnc(algorithm, K, r) {
  return kdf(algorithm, K, r, 1);
}

export function kdfMac(algorithm, K, r) {
  return kdf(algorithm, K, r, 2);
}

export function kdfPi(algorithm, K) {
  return kdf(algorithm, K, undefined, 3);
}

// TR-03110-3 v2.21 A.2.3.
export function kdf(algorithm, K, r, c) {
  algorithm = algorithms[algorithm];

  const cbuf = Buffer.alloc(4);
  cbuf.writeUInt32BE(c);

  const hash = createHash(algorithm.hash);
  hash.update(Buffer.concat([K, r, cbuf].filter(Boolean)));
  return hash.digest().subarray(0, algorithm.length);
}

export function adjustParity(data) {
  const adjusted = [];
  for (const x of data) {
    const y = x & 0xfe;
    let parity = 0;
    for (let z = 0; z < 8; z += 1) {
      parity += (y >> z) & 1;
    }
    const s = y + (parity % 2 === 0 ? 1 : 0);
    adjusted.push(s);
  }

  return Buffer.from(adjusted);
}
