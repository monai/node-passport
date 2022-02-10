import { decode as decodeNumber } from '../../adf/ef_adn.js';

// ETSI TS 102 223 V15.3.0 (2019-07)

// 8.1 Address DO'06
export const npiLabels = {
  0b0000: 'Unknown',
  0b0001: 'ISDN/telephony numbering plan (Recommendations ITU-T E.164 and E.163)',
  0b0011: 'Data numbering plan (Recommendation ITU-T X.121)',
  0b0100: 'Telex numbering plan (Recommendation ITU-T F.69)',
  0b1001: 'Private numbering plan',
  0b1111: 'Reserved for extension',
};

export const tonLabels = {
  0b000: 'Unknown',
  0b001: 'International Number',
  0b010: 'National Number',
  0b011: 'Network Specific Number',
};

export function encode() {
  throw new Error('Not implemented');
}

export function decode(data) {
  const byte0 = data[0];
  const npi = byte0 & 0x0f;
  const ton = (byte0 >> 4) & 0x07;
  const number = decodeNumber(data.slice(1));

  return {
    npi,
    npiLabel: npiLabels[npi],
    ton,
    tonLabel: tonLabels[ton],
    number,
  };
}
