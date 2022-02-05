// ETSI TS 102 225 V16.0.0 (2020-06)

const b2b1Labels = {
  0b00: 'Algorithm known implicitly by both entities',
  0b01: 'DES',
  0b10: 'AES',
  0b11: 'Proprietary Implementations',
};

const b4b3Labels = {
  0b01: {
    0b00: 'Reserved for DES as defined in previous releases',
    0b01: 'Triple DES in outer-CBC mode using two different keys',
    0b10: 'Triple DES in outer-CBC mode using three different keys',
    0b11: 'Reserved for DES as defined in previous releases',
  },
  0b10: {
    0b00: 'AES in CBC mode',
    0b01: 'Reserved',
    0b10: 'Reserved',
    0b11: 'Reserved',
  },
};

const b8b5Label = 'Indication of Keys to be used';

module.exports = {
  decode,
};

// 5.1.2 Coding of the KIc
function decode(data) {
  const b2b1 = data & 0b11;
  const b2b1Label = b2b1Labels[b2b1];

  const b4b3 = (data >> 2) & 0b11;
  const b4b3Label = b4b3Labels[b2b1]?.[b4b3];

  const b8b5 = (data >> 4) & 0b1111;

  return {
    b2b1,
    b2b1Label,
    b4b3,
    b4b3Label,
    b8b5,
    b8b5Label,
  };
}
