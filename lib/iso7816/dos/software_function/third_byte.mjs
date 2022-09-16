// ISO/IEC 7816-4:2013(E)
// Table 119 — Coding of the third software function table (command chaining,
// length fields and logical channels)

import Bitset from '../../../bitset.mjs';

const logicalChannelNumberAssignmentLabels = {
  0b00: 'Only basic logical channel available',
  0b01: 'Logical channel number assignment by the interface device',
  0b10: 'Logical channel number assignment by the card',
};

export function encode() {
  throw new Error('Not implemented');
}

export function decode(byte) {
  const bitset = Bitset.from(byte, 8);
  const b5b4 = (byte >> 3) & 0b11;
  const b3b1 = byte & 0b111;

  return {
    commandChaining: bitset.test(7),
    extendedLcAndLeFields: bitset.test(6),
    extendedLengthInformationInEfAtrInfo: bitset.test(5),
    logicalChannel: {
      numberAssignment: logicalChannelNumberAssignmentLabels[b5b4],
      maximumNumber: b3b1 + 1,
    },
  };
}
