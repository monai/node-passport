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
    buffer[n - m] = length >> m * 8 & 0xff;
  } while (++m < n);

  return buffer;
}

function decode(length) {
  if (length[0] <= 0x7f) {
    return [length[0], 1];
  }

  const n = length[0] & 0x7f;
  let out = 0;
  let m = 0;
  do {
    out = out << 8 ^ length[m + 1];
  } while (++m < n);

  return [out, n];
}
