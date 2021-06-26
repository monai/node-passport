module.exports = {
  encode,
  decode,
  inspect,
};

function encode(oid) {
  oid = oid.map((number) => {
    if (typeof number === 'bigint') {
      if (number > Number.MAX_SAFE_INTEGER) {
        throw new RangeError('Number is greater than max safe integer');
      }

      return BigInt.asUintN(53, number);
    }

    return number;
  });

  const first = (oid[0] ?? 0) * 40 + oid[1] ?? 0;
  oid = [first, ...oid.slice(2)];

  const out = [];
  for (const number of oid) {
    const n = number === 0 ? 1 : Math.ceil(Math.log2(number) / 7) || 1;

    for (let i = 0; i < n; i += 1) {
      const position = (i + 1 < n) ? 0x80 : 0x00;
      const bits = (number >> ((n - i - 1) * 7)) & 0x7f;
      const byte = Buffer.from([position | bits]);
      out.push(byte);
    }
  }

  return Buffer.concat(out);
}

function decode(data) {
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

function inspect(data) {
  return decode(data).join('.');
}
