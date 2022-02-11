// ETSI TS 102 223 V15.3.0 (2019-07)

import { decode as decodeAlphaIdentifier } from './alpha_identifier.mjs';

// 8.9 Item DO'0F
export function encode() {
  throw new Error('Not implemented');
}

export function decode(data) {
  const identifier = data[0];
  data = data.slice(1);

  const text = decodeAlphaIdentifier(data);

  return {
    identifier,
    text,
  };
}
