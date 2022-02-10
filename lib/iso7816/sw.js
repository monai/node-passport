export default parse;

function parse(sw1, sw2) {
  if (Buffer.isBuffer(sw1) && sw1.length >= 2) {
    [sw1, sw2] = sw1;
    return [sw1, sw2];
  }

  if ([sw1, sw2].every((sw) => Buffer.isBuffer(sw) && sw.length > 0)) {
    return [sw1[0], sw2[0]];
  }

  if (typeof sw1 === 'number') {
    if (typeof sw2 === 'number') {
      return [sw1 & 0xff, sw2 & 0xff];
    }

    return [(sw1 >> 8) & 0xff, sw1 & 0xff];
  }

  return new Array(2);
}
