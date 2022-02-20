// ETSI TS 102 221 V16.0.0 (2019-07)
// 9.5.2 PIN status indication

import Bitset from '../../comprehension_tlv/do/bitset.mjs';

export function encode() {
  throw new Error('Not implemented');
}

export function decode(data) {
  const bitset = new Bitset(0, data.length * 8);

  for (const [i, byte] of data.entries()) {
    let l = 8;
    // eslint-disable-next-line no-plusplus
    while (l--) {
      if (byte & (1 << i * 8 + l)) {
        bitset.set(i * 8 - l + 7);
      }
    }
  }

  return bitset;
}

export function inspect(data) {
  return decode(data).toString();
}
