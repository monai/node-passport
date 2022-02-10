// ETSI TS 102 223 V15.3.0 (2019-07)

import { decode as decodeSmsDataCodingScheme } from '../../sms_data_coding_scheme.mjs';

// 8.15 Text string DO'0D
export function encode() {
  throw new Error('Not implemented');
}

export function decode(data) {
  const codingScheme = decodeSmsDataCodingScheme(data[0]);
  data = data.slice(1);

  if ([1, 2].includes(codingScheme.characterSet)) {
    return data.toString();
  }

  return undefined;
}
