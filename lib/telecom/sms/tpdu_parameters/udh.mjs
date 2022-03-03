// ETSI TS 123 040 V16.0.0 (2020-07)
// 9.2.3.24 TP-User Data (TP-UD)

export const inspect = decode;

export function encode() {
  throw new Error('Not implemented');
}

export function decode(data) {
  const out = [];

  let read = 0;
  while (read < data.length) {
    const [iei, ieidl] = data;

    const ie = {
      iei,
      ieidl,
    };

    if (ieidl) {
      ie.ied = data.slice(2, ieidl);
    }

    out.push(ie);

    read += 2 + ieidl;
  }

  return out;
}
