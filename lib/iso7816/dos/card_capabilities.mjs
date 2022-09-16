// ISO/IEC 7816-4:2013(E)
// 12.1.1.9 Card capabilities

import Bitset from '../../bitset.mjs';
import { decodeDataCoding } from '../templates/file_control_information/dos/file_descriptor.mjs';

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

const logicalChannelNumberAssignmentLabels = {
  0b00: 'Only basic logical channel available',
  0b01: 'Logical channel number assignment by the interface device',
  0b10: 'Logical channel number assignment by the card',
};

export function encode() {
  throw new Error('Not implemented');
}

export function decode(data) {
  const bitset0 = Bitset.from(data[0], 8);
  const selectionMethods = [];

  for (let i = 0; i < 8; i += 1) {
    if (bitset0.test(i)) {
      selectionMethods.push(selectionMethodLabels[i]);
    }
  }

  const out = {
    selectionMethods,
  };

  if (data.length > 1) {
    out.dataCoding = decodeDataCoding(data[1]);
  }

  if (data.length > 2) {
    const byte2 = data[2];
    const bitset2 = Bitset.from(byte2, 8);
    const b5b4 = (byte2 >> 3) & 0b11;
    const b3b1 = byte2 & 0b111;

    out.commandChaining = bitset2.test(7);
    out.extendedLcAndLeFields = bitset2.test(6);
    out.extendedLengthInformationInEfAtrInfo = bitset2.test(5);
    out.logicalChannelNumberAssignment = logicalChannelNumberAssignmentLabels[b5b4];
    out.maximumNumberOfLogicalChannels = b3b1 + 1;
  }

  return out;
}
