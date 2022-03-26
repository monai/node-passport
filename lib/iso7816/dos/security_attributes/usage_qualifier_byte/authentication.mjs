// ISO/IEC 7816-4:2013
// Table 57 — Coding of the usage qualifier byte

import Bitset from '../../../../bitset.mjs';

const labels = {
  2: 'User authentication, biometry based',
  3: 'User authentication, password based',
  6: 'Internal authentication',
  7: 'External authentication',
};

export function encode() {
  throw new Error('Not implemented');
}

export function decode(data) {
  return Bitset.from(data, 8);
}

export function inspect(data) {
  const out = [];
  for (const [n, value] of decode(data).entries()) {
    if (value) {
      out.push(labels[n]);
    }
  }

  return out;
}
