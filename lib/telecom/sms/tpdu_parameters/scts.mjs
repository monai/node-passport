// ETSI TS 123 040 V16.0.0 (2020-07)
// 9.2.3.11 TP-Service-Centre-Time-Stamp (TP-SCTS)

import { decode as decodeSemiOctet } from '../semi_octet_numeric.mjs';

export const inspect = decode;

export function encode() {
  throw new Error('Not implemented');
}

export function decode(data) {
  const nibs = [...decodeSemiOctet(data)];

  const parts = [];
  for (let i = 0; i < nibs.length; i += 2) {
    parts.push(nibs[i] * 10 + nibs[i + 1]);
  }

  const [y, m, d, H, M, S, z] = parts;
  const yy = y + 2000;
  const mm = m - 1;
  const MM = M + z * 15;

  return new Date(Date.UTC(yy, mm, d, H, MM, S));
}
