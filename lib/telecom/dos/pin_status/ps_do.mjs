// ETSI TS 102 221 V16.0.0 (2019-07)
// Table 9.4: Usage qualifier coding for PS_DO

// AT Authentication Template
// CCT Cryptographic Checksum Template
// CT Confidentiality Template
// DST Digital Signature Template

export const bitLabels = {
  0x80: 'see Table 9.4',
  0x40: 'see Table 9.4',
  0x20: 'see Table 9.4',
  0x10: 'see Table 9.4',
  0x08: 'see Table 9.4',
  0x04: 'see Table 9.4',
};

export const valueLabels = {
  0b00: 'the verification requirement is not used for verification',
  0b01: 'RFU',
  0b10: 'RFU',
  0b11: 'RFU',
};

export function encode() {
  throw new Error('Not implemented');
}

export function decode(data) {
  const byte0 = data[0];

  return byte0;
}
