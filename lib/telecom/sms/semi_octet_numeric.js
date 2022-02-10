// ETSI TS 123 040 V16.0.0 (2020-07)

export function encode() {
  throw new Error('Not implemented');
}

// 9.1.2.3 Semi-octet representation
export function* decode(data) {
  for (const byte of data) {
    const hi = (byte >> 4) & 0x0f;
    const lo = byte & 0x0f;

    for (const nib of [lo, hi]) {
      if (nib !== 0x0f) {
        yield nib;
      }
    }
  }
}
