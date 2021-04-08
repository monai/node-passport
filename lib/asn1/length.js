/* eslint-disable no-plusplus */
module.exports = {
  encode,
  decode,
};

function encode(length) {
  if (length <= 0x7f) {
    return Buffer.from([length]);
  }

  const n = Math.ceil(Math.log2(length) / 8);
  const buffer = Buffer.alloc(n + 1);
  buffer[0] = 0x80 ^ n;

  let m = 0;
  do {
    buffer[n - m] = (length >> m * 8) & 0xff;
  } while (++m < n);

  return buffer;
}

function decode(data) {
  if (data[0] <= 0x7f) {
    return [data[0], 1];
  }

  if (data[0] === 0x80) {
    return [Infinity, 1];
  }

  let out = 0;
  let m = 1;
  let n = data[0] & 0x7f;

  if (n >= 7 && data[0] > 0x1f) {
    throw new RangeError('Encoded length is greater than max safe integer');
  }

  while (n--) {
    out += data[m++];
    if (n > 0) {
      out *= 0x100;
    }
  }

  return [out, m];
}
