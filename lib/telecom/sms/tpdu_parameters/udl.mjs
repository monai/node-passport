// ETSI TS 123 040 V16.0.0 (2020-07)
// 9.2.3.16 TP-User-Data-Length (TP-UDL)

import { characterLength } from '../../sms_data_coding_scheme.mjs';
import { decode as decodeInteger } from '../integer.mjs';

export const inspect = decode;

export function encode() {
  throw new Error('Not implemented');
}

export function decode(data, { characterSet }) {
  const charLength = characterLength[characterSet];

  let length = decodeInteger(data);
  if (charLength === 7) {
    length = Math.ceil((length / 8) * 7);
  }

  return length;
}
