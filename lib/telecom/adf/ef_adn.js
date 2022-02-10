// ETSI TS 131 102 V16.9.0 (2022-01)

import { decode as decodeSemiOctet } from '../sms/semi_octet_numeric.js';

// 4.4.2.3 EF_ADN (Abbreviated dialling numbers)
// Table 4.4: Extended BCD coding
const bcdCoding = {
  0xA: '*',
  0xB: '#',
  0xC: '', // DTMF Control digit separator (see TS 22.101).
  0xD: '', // "Wild" value. This will cause the MMI to prompt the user for a single digit (see TS 22.101).
  0xE: '', // RFU
  0xF: '', // Endmark e.g. in case of an odd number of digits.
};

export function encode() {
  throw new Error('Not implemented');
}

export function decode(data) {
  const out = [];

  for (const nib of decodeSemiOctet(data)) {
    if (nib < 0xA) {
      out.push(nib);
    } else if (nib < 0xC) {
      out.push(bcdCoding[nib]);
    } else if (nib < 0xF) {
      out.push(nib.toString(16));
    } else {
      break;
    }
  }

  return out.join('');
}
