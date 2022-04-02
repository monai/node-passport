// ISO/IEC 7816-4:2013
// Table 57 — Coding of the usage qualifier byte

// ISO/IEC CD2 7816-11
// Table 6 — Coding of the usage qualifier based on ISO/IEC 7816-9

import Bitset from '../../../../bitset.mjs';

export default function create(labels) {
  function encode() {
    throw new Error('Not implemented');
  }

  function decode(data) {
    return Bitset.from(data, 8);
  }

  function inspect(data) {
    const out = [];
    for (const [n, value] of decode(data).entries()) {
      if (value) {
        out.push(labels[n]);
      }
    }

    return out;
  }

  return {
    encode,
    decode,
    inspect,
  };
}
