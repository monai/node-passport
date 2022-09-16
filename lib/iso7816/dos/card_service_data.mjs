// ISO/IEC 7816-4:2013(E)
// 12.1.1.5 Card service data

import Bitset from '../../bitset.mjs';

const applicationSelectionLabels = {
  [1 << 7]: 'by full DF name',
  [1 << 6]: 'by partial DF name',
};

const dosAvailableLabels = {
  [1 << 5]: 'in EF.DIR',
  [1 << 4]: 'in EF.ATR/INFO',
};

const accessServicesLabels = {
  4: 'by the READ BINARY command (transparent structure)',
  0: 'by the READ RECORD (S) command (record structure)',
  2: 'by the GET DATA command (BER-TLV structure)',
};

const masterFileLabels = {
  0: 'Card with MF',
  1: 'Card without MF',
};

export function encode() {
  throw new Error('Not implemented');
}

export function decode(data) {
  return Bitset.from(data);
}

export function inspect(data) {
  const byte0 = data[0];
  const bitset = Bitset.from(data, 8);

  const applicationSelection = Object.entries(applicationSelectionLabels)
    .map(([bit, label]) => byte0 & bit && label)
    .filter(Boolean);

  const dosAvailable = Object.entries(dosAvailableLabels)
    .map(([bit, label]) => byte0 & bit && label)
    .filter(Boolean);

  const accessServices = accessServicesLabels[(byte0 >> 1) & 0b111];
  const masterFile = masterFileLabels[byte0 & 1];

  return {
    data: bitset,
    applicationSelection,
    dosAvailable,
    accessServices,
    masterFile,
  };
}
