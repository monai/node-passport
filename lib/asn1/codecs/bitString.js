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
  const bytes = [];
  const unused = data.slice(0, 1).readUInt8();

  for (const byte of data.slice(1)) {
    bytes.push(byte.toString(2).padStart(8, '0'));
  }

  const out = bytes.join('');
  return unused ? `${'_'.repeat(unused)}${out.slice(0, -unused)}` : out;
}
