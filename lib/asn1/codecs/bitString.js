module.exports = {
  encode,
  decode,
  inspect,
};

function encode() {

}

function decode(data) {
  return data;
}

function inspect(data) {
  const out = [];
  const unused = data.slice(0, 1);

  for (let byte of data.slice(1)) {
    out.push(byte.toString(2));
  }

  return out.join('').slice(0, -unused);
}
