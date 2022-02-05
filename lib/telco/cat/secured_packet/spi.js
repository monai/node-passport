// ETSI TS 102 225 V16.0.0 (2020-06)

const B1b2b1Labels = {
  0b00: 'No RC, CC or DS',
  0b01: 'Redundancy Check',
  0b10: 'Cryptographic Checksum',
  0b11: 'Reserved for Digital Signature',
};

const B1b3Labels = {
  0b0: 'No Ciphering',
  0b1: 'Ciphering',
};

const B1b5b4Labels = {
  0b00: 'No counter available',
  0b01: 'Counter available; no replay or sequence checking',
  0b10: 'Process if and only if counter value is higher than the value in the RE',
  0b11: 'Process if and only if counter value is one higher than the value in the RE',
};

const B1b8b6Label = 'Reserved (set to zero and ignored by RE)';

const B2b2b1Labels = {
  0b00: 'No PoR reply to the SE',
  0b01: 'PoR required to be sent to the SE',
  0b10: 'PoR required only when an error has occurred',
  0b11: 'Reserved',
};

const B2b4b3Labels = {
  0b00: 'No RC, CC or DS applied to PoR response to SE',
  0b01: 'PoR response with simple RC applied to it',
  0b10: 'PoR response with CC applied to it',
  0b11: 'Reserved for PoR response with DS applied to it',
};

const B2b5Labels = {
  0b0: 'PoR response shall not be ciphered',
  0b1: 'PoR response shall be ciphered',
};

const B2b6Label = 'Reserved for TS 31.115';

const B2b8b7Label = 'Reserved (set to zero and ignored by RE)';

module.exports = {
  decode,
};

// 5.1.1 Coding of the SPI
function decode(data) {
  const B1 = data[0];
  const B2 = data[1];

  const B1b2b1 = B1 & 0b11;
  const B1b2b1Label = B1b2b1Labels[B1b2b1];

  const B1b3 = (B1 >> 2) & 0b1;
  const B1b3Label = B1b3Labels[B1b3];

  const B1b5b4 = (B1 >> 3) & 0b11;
  const B1b5b4Label = B1b5b4Labels[B1b5b4];

  const B1b8b6 = (B1 >> 5) & 0b111;

  const B2b2b1 = B2 & 0b11;
  const B2b2b1Label = B2b2b1Labels[B2b2b1];

  const B2b4b3 = (B2 >> 2) & 0b11;
  const B2b4b3Label = B2b4b3Labels[B2b4b3];

  const B2b5 = (B2 >> 4) & 0b1;
  const B2b5Label = B2b5Labels[B2b5];

  const B2b6 = (B2 >> 5) & 0b1;

  const B2b8b7 = (B2 >> 6) & 0b11;

  return {
    B1b2b1,
    B1b2b1Label,
    B1b3,
    B1b3Label,
    B1b5b4,
    B1b5b4Label,
    B1b8b6,
    B1b8b6Label,
    B2b2b1,
    B2b2b1Label,
    B2b4b3,
    B2b4b3Label,
    B2b5,
    B2b5Label,
    B2b6,
    B2b6Label,
    B2b8b7,
    B2b8b7Label,
  };
}
