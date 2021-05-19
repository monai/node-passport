module.exports = parse;

function parse(sw1, sw2) {
  if (Buffer.isBuffer(sw1) && sw1.length >= 2) {
    [sw1, sw2] = sw1;
    return [sw1, sw2];
  }

  if (
    Buffer.isBuffer(sw1) && sw1.length > 0
    && Buffer.isBuffer(sw2) && sw2.length > 0
  ) {
    return [sw1[0], sw2[0]];
  }

  if (typeof sw1 === 'number' && sw1 > 0xff && sw1 <= 0xffff) {
    return [
      (sw1 >> 8) & 0xff,
      sw1 & 0xff,
    ];
  }
  if (
    typeof sw1 === 'number' && sw1 >= 0 && sw1 <= 0xff
    && typeof sw2 === 'number' && sw2 >= 0 && sw2 <= 0xff
  ) {
    return [sw1, sw2];
  }

  return new Array(2);
}
