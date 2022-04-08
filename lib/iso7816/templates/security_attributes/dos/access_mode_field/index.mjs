// ISO/IEC 7816-4:2013
// Table 17 — Coding of the sole byte in an access mode field for DFs
// Table 29 — Coding of the 3rd byte in an access mode field (2nd AMB) for DOs

import {
  dedicatedFile,
  elementaryFile,
  dataObject,
  securityObject,
  tableAndView,
} from './type.mjs';

import * as dedicatedFileCodec from './dedicated_file.mjs';
import * as elementaryFileCodec from './elementary_file.mjs';
import * as dataObjectCodec from './data_object.mjs';
import * as securityObjectCodec from './security_object.mjs';
import * as tableAndViewCodec from './table_and_view.mjs';

const map = {
  [dedicatedFile]: dedicatedFileCodec,
  [elementaryFile]: elementaryFileCodec,
  [dataObject]: dataObjectCodec,
  [securityObject]: securityObjectCodec,
  [tableAndView]: tableAndViewCodec,
};

export function encode(data, { type }) {
  return map[type].encode(data);
}

export function decode(data, { type }) {
  return map[type].decode(data);
}

export function inspect(data, { type }) {
  return map[type].inspect(data);
}
