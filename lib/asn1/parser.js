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

    const current = {
      tag,
      length,
      offset,
      contents,
      children: [],
    };

    if (tag.encoding === 0 ) {
      offset += rt + rl + length;
    } else {
      offset += rt + rl;
      current.children = parse(contents);
      offset += length;
    }

    out.push(current);
  } while (offset < data.length);

  return out;
}

function readNext(data) {
  const tag = decodeTag(data);
  const length = decodeLength(data.slice(tag.slice(-1)));

  return [tag, length];
}
