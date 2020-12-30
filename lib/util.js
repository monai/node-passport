/* eslint-disable no-console */
const parse = require('./asn1/parse');
const inspect = require('./asn1/inspect');

module.exports = {
  formatHex,
  readUIntBE,
  ab2aba,
  hex2buf,
  printBer,
};

function formatHex(number) {
  const string = number.toString(16);
  return string.length % 2 ? `0${string}` : string;
}

function readUIntBE(buf) {
  return buf[[
    'readUInt32BE',
    'readUInt16BE',
    'readUInt8',
  ][4 >> buf.length]]();
}

function ab2aba(buf) {
  return Buffer.concat([buf, buf.slice(0, Math.trunc(buf.length / 2))]);
}

function hex2buf(strings) {
  return Buffer.from(strings.join('').replace(/[^\da-z]/gi, ''), 'hex');
}

function printBer(data, { type } = {}) {
  const tree = parse(data);
  console.log(inspect(tree, { depth: 20, colors: true, type }));
}
