const { decode: decodeTag } = require('./tag');
const { decode: decodeLength } = require('./length');

module.exports = parse;

function parse(data) {
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

    offset += rt + rl;
    if (tag.encoding === 1) {
      node.children = parse(contents);
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
