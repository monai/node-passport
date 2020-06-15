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
  const unused = data.slice(0, 1).readUInt8();

  for (let byte of data.slice(1)) {
    out.push(byte.toString(2));
  }

  let str = out.join('').slice(0, -unused);

  return str.padStart(Math.ceil(str.length / 8) * 8, '0');
}
