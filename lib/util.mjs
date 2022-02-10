/* eslint-disable no-console */
import parse from './asn1/util/parse.mjs';
import inspect from './asn1/tree/inspect.mjs';
import noTail from './asn1/util/no_tail.mjs';

export function formatHex(number) {
  const str = number.toString(16);
  return str.length % 2 ? `0${str}` : str;
}

export function readUIntBE(buf) {
  return buf[[
    'readUInt32BE',
    'readUInt16BE',
    'readUInt8',
  ][4 >> buf.length]]();
}

export function writeUIntBE(buf, value) {
  return buf[[
    'writeUInt32BE',
    'writeUInt16BE',
    'writeUInt8',
  ][4 >> buf.length]](value);
}

export function ab2aba(buf) {
  return Buffer.concat([buf, buf.slice(0, buf.length / 2 | 0)]);
}

export function hex2buf(strings) {
  return Buffer.from(strings.join('').replace(/[^a-z0-9]/ig, ''), 'hex');
}

export function printBer(data, options = {}) {
  const tree = parse(data);
  if (options.noTail) {
    tree.node = noTail(tree.node);
  }

  console.log(inspect(tree.node, { depth: 20, colors: true, type: options.type }));
}
