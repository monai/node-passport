const { decode: decodeTag } = require('./tag');
const { decode: decodeLength } = require('./length');
const parse = require('./util/parse');

module.exports = treeForcedParser;

function treeForcedParser(node) {
  if (node.tag && node.tag.identifier === 0x04 && Buffer.isBuffer(node.contents)) {
    // TODO: add lookahead for multiple tags
    const [, rt] = decodeTag(node.contents);
    const [length, rl] = decodeLength(node.contents.slice(rt));

    if (rt + length + rl === node.contents.length) {
      Array.prototype.push.apply(node.children, parse(node.contents).children);
    }
  }

  node.children = node.children.map((childNode) => treeForcedParser(childNode));
  return node;
}
