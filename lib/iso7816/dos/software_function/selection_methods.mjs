// ISO/IEC 7816-4:2013(E)
// Table 117 — Coding of the first software function table (selection methods)

import Bitset from '../../../bitset.mjs';

const selectionMethodLabels = {
  7: 'DF selection by full DF name',
  6: 'DF selection by partial DF name',
  5: 'DF selection by path',
  4: 'DF selection by file identifier',
  3: 'Implicit DF selection',
  2: 'Short EF identifier supported',
  1: 'Record number supported',
  0: 'Record identifier supported',
};

export function encode() {
  throw new Error('Not implemented');
}

export function decode(byte) {
  const bitset0 = Bitset.from(byte, 8);
  const out = [];

  for (let i = 0; i < 8; i += 1) {
    if (bitset0.test(i)) {
      out.push(selectionMethodLabels[i]);
    }
  }

  return out;
}
