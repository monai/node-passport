// ISO/IEC 7816-4:2013
// Table 17 — Coding of the sole byte in an access mode field for DFs

import Bitset from '../../../../bitset.mjs';

export const inspect = decode;

export function encode() {
  throw new Error('Not implemented');
}

export function decode(data) {
  if (data.length > 1) {
    return data;
  }

  return Bitset.from(data, 8);
}
