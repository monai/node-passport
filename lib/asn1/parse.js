const { decode: decodeTag } = require('./tag');
const { decode: decodeLength } = require('./length');

module.exports = parse;

function parse(data, options = {}) {
  const out = [];
  let offset = 0;
  do {
    const view = data.slice(offset);
    const [readTag, readLength] = readNext(view);

    const [tag, rt] = readTag;
    const [length, rl] = readLength;
    const start = rt + rl;
    const end = start + length;
    const contents = view.slice(start, end);
    const viewData = view.slice(0, end);

    const node = {
      tag,
      length,
      offset,
      contents,
      data: viewData,
      children: [],
    };

    // Force parsing DER encoded OCTECT STRINGs
    const force = options.force && tag.number === 0x04 && contents[0] === 0x30;

    offset += rt + rl;
    if (tag.encoding === 1 || force) {
      node.children = parse(contents, options);
    }
    offset += length;

    out.push(node);
  } while (offset < data.length);

  return out;
}

function readNext(data) {
  const tag = decodeTag(data);
  const length = decodeLength(data.slice(tag.slice(-1)));

  return [tag, length];
}
