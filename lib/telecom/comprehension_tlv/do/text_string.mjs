// ETSI TS 102 223 V15.3.0 (2019-07)

import { decode as decodeSmsDataCodingScheme } from '../../sms_data_coding_scheme.mjs';

// 8.15 Text string DO'0D
export function encode() {
  throw new Error('Not implemented');
}

export function decode(data) {
  const codingScheme = decodeSmsDataCodingScheme(data[0]);
  data = data.slice(1);

  if (codingScheme.characterSet === 2) {
    const out = [];
    for (let i = 0; i < data.length; i += 2) {
      out.push(String.fromCodePoint(data.readUInt16BE(i)));
    }
    return out.join('');
  }

  return data.toString();
}
