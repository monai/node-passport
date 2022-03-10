// ETSI TS 102 225 V16.0.0 (2020-06)

const b2b1Labels = {
  0b00: {
    0b00: 'Algorithm known implicitly by both entities',
    0b01: undefined,
    0b10: undefined,
    0b11: 'Proprietary Implementations',
  },
  0b01: {
    0b00: 'Algorithm known implicitly by both entities',
    0b01: 'CRC',
    0b10: 'Reserved',
    0b11: 'Proprietary Implementations',
  },
  0b10: {
    0b00: 'Algorithm known implicitly by both entities',
    0b01: 'DES',
    0b10: 'AES',
    0b11: 'Proprietary Implementations',
  },
  0b11: {
    0b00: 'Algorithm known implicitly by both entities',
    0b01: undefined,
    0b10: undefined,
    0b11: 'Proprietary Implementations',
  },
};

const b4b3Labels = {
  0b01: {
    0b01: {
      0b00: 'CRC 16',
      0b01: 'CRC 32',
      0b10: 'Reserved',
      0b11: 'Reserved',
    },
    0b11: {
      0b00: 'Reserved',
      0b01: 'Reserved',
      0b10: 'Reserved',
      0b11: 'Reserved',
    },
  },
  0b10: {
    0b01: {
      0b00: 'Reserved for DES as defined in previous releases',
      0b01: 'Triple DES in outer-CBC mode using two different keys',
      0b10: 'Triple DES in outer-CBC mode using three different keys',
      0b11: 'Reserved for DES as defined in previous releases',
    },
    0b10: {
      0b00: 'AES in CMAC mode',
      0b01: 'Reserved',
      0b10: 'Reserved',
      0b11: 'Reserved',
    },
  },
};

const b8b5Labels = {
  0b01: 'For Proprietary use or For GlobalPlatform security architecture compliant cards: Key Version Number to be used',
  0b10: 'Indication of Keys to be used',
};

export function encode() {
  throw new Error('Not implemented');
}

// 5.1.3 Coding of the KID
export function decode(data, SPIB1b2b1) {
  const b2b1 = data & 0b11;
  const b2b1Label = b2b1Labels[SPIB1b2b1][b2b1];

  const b4b3 = (data >> 2) & 0b11;
  const b4b3Label = b4b3Labels[SPIB1b2b1]?.[b2b1]?.[b4b3];

  const b8b5 = (data >> 4) & 0b1111;
  const b8b5Label = b8b5Labels[SPIB1b2b1];

  return {
    b2b1,
    b2b1Label,
    b4b3,
    b4b3Label,
    b8b5,
    b8b5Label,
  };
}
