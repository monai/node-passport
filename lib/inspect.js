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
  const view = data.slice(offset);
  const [tag, length] = readNext(view);
  print(depth, view, tag, length, options);

  const encoding = tag[1];
  const rt = tag[3];
  const [len, rl] = length;

  if (encoding === 0) {
    offset += rt + rl + len;
  } else {
    offset += rt + rl
  }

  if (offset < data.length) {
    _inspect(data, options, offset, depth + encoding);
  }
}

function readNext(data) {
  const tag = decodeTag(data);
  const length = decodeLength(data.slice(tag.slice(-1)));

  return [tag, length];
}

function print(depth, data, tag, length, options) {
  const [klass, encoding, number, rt] = tag;
  const [len, rl] = length;

  const indent = Array(2 * depth + 1).join(' ');
  const tagHex = data.slice(0, rt).toString('hex');
  const lengthHex = data.slice(rt, rt + rl).toString('hex');
  const encodingValue = options.encoding[encoding][0];
  const klassValue = options.klass[klass][0];
  const typeValue = options.tag[klass][number];

  let str = [
    `${indent}-`,
    `0x${tagHex} ${encodingValue}[${number}]`,
    `0x${lengthHex}[${len}]`,
    '::',
    `${klassValue}[${typeValue}]`
  ];

  if (encoding === 0) {
    const start = rt + rl;
    const view = data.slice(start, start + len);

    Array.prototype.push.apply(str, [
      (number !== 16) && `[${view.inspect()}]`,
      (number !== 16) && view,
    ]);
  }

  str = str.filter(Boolean).join(' ');

  console.log(str);
}