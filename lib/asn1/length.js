/* eslint-disable no-plusplus */

const Asn1Error = require('./error');

const LengthError = require('./LengthError');

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
  if (data[0] === 0xff) {
    throw new Asn1Error('X.690 (11/2008) 8.1.3.5 c) the value 0xff shall not be used');
  }

  if (data[0] <= 0x7f) {
    return [data[0], 1];
  }

  if (data[0] === 0x80) {
    return [Infinity, 1];
  }

  let n = data[0] & 0x7f;

  if (data.length < n + 1) {
    throw new LengthError(n + 1, data.length);
  }

  if (n >= 7 && data[1] > 0x1f) {
    throw new RangeError('Length is greater than max safe integer');
  }

  let out = 0;
  let m = 1;
  while (n--) {
    out += data[m++];
    if (n > 0) {
      out *= 0x100;
    }
  }

  return [out, m];
}
