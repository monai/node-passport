module.exports = {
  encode,
  decode,
  inspect: decode,
};

function encode() {

}

function decode(data) {
  const out = [];

  for (let i = 0; i < data.length; i += 2) {
    out.push(String.fromCodePoint((data[i] << 8) | data[i + 1]));
  }

  return out.join('');
}
