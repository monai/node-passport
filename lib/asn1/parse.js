const { decode: decodeTag } = require('./tag');
const { decode: decodeLength } = require('./length');
const { constructed } = require('./encoding');

module.exports = parse;

const containers = [0x30, 0x31]; // SEQUENCE and SET

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
    let force = false;
    if (options.force && tag.identifier === 0x04) {
      const [[ftag, frt], [flength, frl]] = readNext(contents);
      force = containers.includes(ftag.identifier) && frt + flength + frl === contents.length;
    }

    offset += rt + rl;
    if (tag.encoding === constructed || force) {
      node.children = parse(contents, options);
    }
    offset += length;

    out.push(node);
  } while (offset < data.length);

  return out;
}

function readNext(data) {
  const tag = decodeTag(data);
  const lengthData = data.slice(tag.slice(-1));
  const length = lengthData.length > 0 ? decodeLength(lengthData) : [0, 0];

  return [tag, length];
}
