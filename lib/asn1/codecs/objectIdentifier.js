module.exports = {
  encode,
  decode,
  inspect,
};

function encode() {

}

function decode(data) {
  const out = [];
  let num = 0;

  for (let i = 0; i < data.length; i += 1) {
    if (i === 0) {
      out.push((data[i] / 40).toFixed());
      out.push(data[i] % 40);
    } else {
      const m = data[i];
      num |= m & 0x7f;
      if (m & 0x80) {
        num <<= 7;
      } else {
        out.push(num);
        num = 0;
      }
    }
  }

  return out;
}

function inspect(data) {
  return decode(data).join('.');
}
