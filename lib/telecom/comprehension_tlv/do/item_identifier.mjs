// ETSI TS 102 223 V15.3.0 (2019-07)

import parser from '../parser.mjs';

// 8.10 Item DO'10
export function encode() {
  throw new Error('Not implemented');
}

export function decode(data) {
  const [, value] = [...parser(data)];
  return value;
}
