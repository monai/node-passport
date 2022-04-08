// ISO/IEC 7816-4:2013
// Table 17 — Coding of the sole byte in an access mode field for DFs

import { decode as decodeAccessModeField } from '../access_mode_field/index.mjs';
import { decode as decodeSecurityConditionByte } from '../security_condition_byte.mjs';

export const inspect = decode;

export function encode() {
  throw new Error('Not implemented');
}

export function decode(data, { type }) {
  const accessModeFields = decodeAccessModeField(data, { type });
  data = data.slice(accessModeFields.length);

  const out = [];
  for (const amf of accessModeFields) {
    const securityCondition = [];
    for (const test of amf.data) {
      if (test) {
        securityCondition.push(decodeSecurityConditionByte(data));
        data = data.slice(1);
      }
    }

    out.push({
      accessMode: amf.data,
      labels: amf.labels,
      securityCondition,
    });
  }

  return out;
}
