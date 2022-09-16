// ISO/IEC 7816-4:2013(E)
// 12.1.1.9 Card capabilities

import { decode as decodeSelectionMethods } from './software_function/selection_methods.mjs';
import { decode as decodeDataCoding } from './software_function/data_coding.mjs';
import { decode as decodeThirdByte } from './software_function/third_byte.mjs';

export function encode() {
  throw new Error('Not implemented');
}

export function decode(data) {
  const out = {
    selectionMethods: decodeSelectionMethods(data[0]),
  };

  if (data.length > 1) {
    out.dataCoding = decodeDataCoding(data[1]);
  }

  if (data.length > 2) {
    Object.assign(out, decodeThirdByte(data[2]));
  }

  return out;
}
