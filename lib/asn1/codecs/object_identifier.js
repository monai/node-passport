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
