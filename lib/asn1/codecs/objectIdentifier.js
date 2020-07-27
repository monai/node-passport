module.exports = {
  encode,
  decode,
  inspect,
};

function encode() {

}

function decode(data) {
  const out = [];

  for (const number of data) {
    out.push(number);
  }

  return out;
}

function inspect(data) {
  return decode(data).join('.');
}
