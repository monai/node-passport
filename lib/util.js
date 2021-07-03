/* eslint-disable no-console */
const parse = require('./asn1/util/parse');
const inspect = require('./asn1/tree_inspect');
const noTail = require('./asn1/util/no_tail');

module.exports = {
  formatHex,
  readUIntBE,
  writeUIntBE,
  ab2aba,
  hex2buf,
  printBer,
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

function writeUIntBE(buf, value) {
  return buf[[
    'writeUInt32BE',
    'writeUInt16BE',
    'writeUInt8',
  ][4 >> buf.length]](value);
}

function ab2aba(buf) {
  return Buffer.concat([buf, buf.slice(0, buf.length / 2 | 0)]);
}

function hex2buf(strings) {
  return Buffer.from(strings.join('').replace(/[^a-z0-9]/ig, ''), 'hex');
}

function printBer(data, options = {}) {
  let tree = parse(data);
  if (options.noTail) {
    tree = noTail(tree);
  }

  console.log(inspect(tree, { depth: 20, colors: true, type: options.type }));
}
