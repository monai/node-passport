// ETSI TS 102 221 V16.0.0 (2019-07)
// 9.5.2 PIN status indication

import Bitset from '../../../bitset.mjs';

export function encode() {
  throw new Error('Not implemented');
}

export function decode(data) {
  return Bitset.from(data);
}

export function inspect(data) {
  return decode(data).toString();
}
