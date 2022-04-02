// ISO/IEC 7816-4:2013
// Table 57 — Coding of the usage qualifier byte

// ISO/IEC CD2 7816-11
// Table 6 — Coding of the usage qualifier based on ISO/IEC 7816-9

import Bitset from '../../../../bitset.mjs';

const labels = {
  0: 'Associated key not to be used',
  4: 'Secure messaging in command data fields',
  5: 'Secure messaging in response data fields',
  6: 'Decipherment',
  7: 'Encipherment',
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
