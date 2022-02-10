// ETSI TS 123 040 V16.0.0 (2020-07)

import { decode as decodeNumeric } from './numeric.mjs';

// 9.1.2.1 Integer representation
export function encode() {
  throw new Error('Not implemented');
}

export function decode(data) {
  let out = 0;

  for (const digit of decodeNumeric(data)) {
    out *= 10;
    out += digit;
  }

  return out;
}
