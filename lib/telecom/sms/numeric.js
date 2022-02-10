// ETSI TS 123 040 V16.0.0 (2020-07)

// 9.1.2.2 Octet representation
// 9.1.2.3 Semi-octet representation
export function encode() {
  throw new Error('Not implemented');
}

export function decode(data) {
  let out = 0;

  for (const digit of data) {
    out *= 10;
    out += digit;
  }

  return out;
}
