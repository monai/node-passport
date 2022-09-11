import log2 from '../../bigint_log2.mjs';

export function encode(arcs) {
  arcs = arcs.map((arc) => BigInt(arc));

  const first = (arcs[0] ?? 0n) * 40n + arcs[1] ?? 0n;
  arcs = [first, ...arcs.slice(2)];

  const out = [];
  for (const arc of arcs) {
    const l2 = log2(arc);
    const n = arc === 0 ? 1 : Math.floor(l2 / 7) + (l2 % 7 ? 1 : 0) || 1;
    const m = BigInt(n);

    if (n > Number.MAX_SAFE_INTEGER) {
      throw new RangeError('Number of bytes required to encode an arc is greater than max safe integer');
    }

    const bytes = Buffer.alloc(Number(n));
    for (let i = 0; i < n; i += 1) {
      const j = BigInt(i);
      const position = (i + 1 < n) ? 0x80 : 0x00;
      const bits = (arc >> ((m - j - 1n) * 7n)) & 0x7fn;
      bytes.writeUInt8(position | Number(bits), i);
    }
    out.push(bytes);
  }

  return Buffer.concat(out);
}

export function decode(data) {
  const out = [];

  let isFirst = true;
  let number = 0n;
  for (const byte of data) {
    const byten = BigInt(byte);
    number |= byten & 0x7fn;
    if (byten & 0x80n) {
      number <<= 7n;
    } else {
      if (isFirst) {
        isFirst = false;
        if (number < 40n) {
          out.push(0n);
          out.push(number);
        } else if (number < 80n) {
          out.push(1n);
          out.push(number - 40n);
        } else {
          out.push(2n);
          out.push(number - 80n);
        }
      } else {
        out.push(number);
      }
      number = 0n;
    }
  }

  return out;
}

export function inspect(data) {
  return decode(data).join('.');
}
