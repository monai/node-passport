const { decode: decodeTag } = require('./asn1/tag');
const { decode: decodeLength } = require('./asn1/length');
const klass = require('./asn1/class');
const type = require('./asn1/type');
const encoding = require('./asn1/encoding');
const codecs = require('./asn1/codecs');
const tag = require('./asn1/tag');

const defaults = {
  klass,
  encoding,
  type,
};

module.exports = createInspector();
Object.assign(module.exports, {
  createInspector,
  _inspect,
});

function createInspector(options = {}) {
  const opts = { ...defaults };

  if (options.type) {
    opts.type = {
      ...opts.type,
      ...options.type
    };
  }

  return function inspect(data) {
    return _inspect(data, opts);
  };
};

function _inspect(data, options = defaults, offset = 0, depth = 0) {
  const view = data.slice(offset);
  const [tagRead, lengthRead] = readNext(view);
  const [tag, rt] = tagRead;
  const [len, rl] = lengthRead;

  print(depth, view, tagRead, lengthRead, options);

  if (tag.encoding === 0) {
    offset += rt + rl + len;
  } else {
    offset += rt + rl
  }

  if (offset < data.length) {
    _inspect(data, options, offset, depth + tag.encoding);
  }
}

function readNext(data) {
  const tag = decodeTag(data);
  const length = decodeLength(data.slice(tag.slice(-1)));

  return [tag, length];
}

function print(depth, data, tagRead, length, options) {
  const [tag, rt] = tagRead;
  const [len, rl] = length;

  const indent = Array(2 * depth + 1).join(' ');
  const tagHex = data.slice(0, rt).toString('hex');
  const lengthHex = data.slice(rt, rt + rl).toString('hex');
  const encodingValue = options.encoding[tag.encoding][0];
  const klassValue = options.klass[tag.klass][0];
  const typeValue = options.type[tag.tagNumber];

  let str = [
    `${indent}-`,
    `0x${tagHex} ${encodingValue}[${tag.number}]`,
    `0x${lengthHex}[${len}]`,
    '::',
    `${klassValue}[${typeValue}]`
  ];

  if (tag.encoding === 0) {
    const start = rt + rl;
    const view = data.slice(start, start + len);
    const decoder = codecs[tag.tagNumber];

    let decoded = view;
    if (decoder) {
      decoded = decoder.inspect(view);
    }

    Array.prototype.push.apply(str, [
      (tag.number !== 16) && `[${view.inspect()}]`,
      (tag.number !== 16) && decoded,
    ]);
  }

  str = str.filter(Boolean).join(' ');

  console.log(str);
}
