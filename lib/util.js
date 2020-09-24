module.exports = {
  formatHex,
  readUIntBE,
  ab2aba,
};

function formatHex(number) {
  const str = number.toString(16);
  return str.length % 2 ? `0${str}` : str;
}

function readUIntBE(buf) {
  return buf[[
    'readUInt32BE',
    'readUInt16BE',
    'readUInt8',
  ][4 >> buf.length]]();
}

function ab2aba(buf) {
  return Buffer.concat([buf, buf.slice(0, buf.length / 2 | 0)]);
}

