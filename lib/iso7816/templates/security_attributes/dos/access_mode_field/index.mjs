// ISO/IEC 7816-4:2013
// Table 17 — Coding of the sole byte in an access mode field for DFs
// Table 29 — Coding of the 3rd byte in an access mode field (2nd AMB) for DOs

import kind from './type.mjs';

import * as dedicatedFile from './dedicated_file.mjs';
import * as elementaryFile from './elementary_file.mjs';
import * as dataObject from './data_object.mjs';
import * as securityObject from './security_object.mjs';
import * as tableAndView from './table_and_view.mjs';

const map = {
  [kind.dedicatedFile]: dedicatedFile,
  [kind.elementaryFile]: elementaryFile,
  [kind.dataObject]: dataObject,
  [kind.securityObject]: securityObject,
  [kind.tableAndView]: tableAndView,
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
