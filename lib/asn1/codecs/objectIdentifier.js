module.exports = {
  encode,
  decode,
  inspect,
};

function encode() {

}

function decode(data) {
  const out = [];

  let isFirst = true;
  let num = 0n;
  for (const byte of data) {
    const byten = BigInt(byte);
    num |= byten & 0x7fn;
    if (byten & 0x80n) {
      num <<= 7n;
    } else {
      if (isFirst) {
        isFirst = false;
        if (num < 40n) {
          out.push(0n);
          out.push(num);
        } else if (num < 80n) {
          out.push(1n);
          out.push(num - 40n);
        } else {
          out.push(2n);
          out.push(num - 80n);
        }
      } else {
        out.push(num);
      }
      num = 0n;
    }
  }

  return out;
}

function inspect(data) {
  return decode(data).join('.');
}
