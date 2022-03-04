// ETSI TS 123 040 V16.0.0 (2020-07)
// 9.2.3.24 TP-User Data (TP-UD)

export const inspect = decode;

export function encode() {
  throw new Error('Not implemented');
}

export function decode(data) {
  const out = [];

  let rl = 0;
  while (rl < data.length) {
    const [iei, ieidl] = data;

    const ie = {
      iei,
      ieidl,
    };

    if (ieidl) {
      ie.ied = data.slice(2, ieidl);
    }

    out.push(ie);

    rl += 2 + ieidl;
  }

  return out;
}

export function read(data) {
  const [udhl] = data;
  data = data.slice(1);

  return [data.slice(0, udhl), udhl + 1];
}
