const { decode: decodeTag } = require('./asn1/tag');
const { decode: decodeLength } = require('./asn1/length');
const klass = require('./asn1/class');
const type = require('./asn1/type');
const encoding = require('./asn1/encoding');

const defaults = {
  klass,
  encoding,
  type,
  tag: {
    0: type,
    1: type,
    2: type,
    3: type,
  }
};

module.exports = createInspector();
Object.assign(module.exports, {
  createInspector,
  _inspect,
});

function createInspector(options = {}) {
  const opts = Object.assign({}, defaults);
  if (options.tag) {
    Object.assign(opts.tag, options.tag);
  }

  return function inspect(data) {
    return _inspect(data, opts);
  };
};

function _inspect(data, options = defaults, offset = 0, depth = 0) {
  let view, klass, encoding, number, length, rt, rl;

  view = data.slice(offset);
  [klass, encoding, number, length, rt, rl] = readNext(view);
  print(depth, klass, encoding, number, length, view, rt, rl, options);

  if (encoding === 0) {
    offset += rt + rl + length;
  } else {
    offset += rt + rl
  }

  if (offset < data.length) {
    _inspect(data, options, offset, depth + encoding);
  }
}

function readNext(data) {
  let rt, rl, klass, encoding, number, length;
  let offset = 0;

  [klass, encoding, number, rt] = decodeTag(data);
  offset += rt;
  [length, rl] = decodeLength(data.slice(offset));
  offset += rl;

  return [klass, encoding, number, length, rt, rl];
}

function print(depth, klass, encoding, number, length, data, rt, rl, options) {
  const indent = Array(2 * depth + 1).join(' ');
  const tagHex = data.slice(0, rt).toString('hex');
  const lengthHex = data.slice(rt, rt + rl).toString('hex');
  const encodingValue = options.encoding[encoding][0];
  const klassValue = options.klass[klass][0];
  const typeValue = options.tag[klass][number];

  let str = [
    `${indent}-`,
    `0x${tagHex} ${encodingValue}[${number}]`,
    `0x${lengthHex}[${length}]`,
    '::',
    `${klassValue}[${typeValue}]`
  ];

  if (encoding === 0) {
    const start = rt + rl;
    const end = start + length;

    Array.prototype.push.apply(str, [
      (number !== 16) && `[${data.slice(start, end).inspect()}]`,
      (number !== 16) && data.slice(start, end),
    ]);
  }

  str = str.filter(Boolean).join(' ');

  console.log(str);
}
