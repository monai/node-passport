const { decode: decodeTag } = require('./tag');
const { decode: decodeLength } = require('./length');
const Parser = require('./parser');
const tree = require('./tree');

module.exports = treeForcedParser;

function treeForcedParser(node) {
  if (node.tag && node.tag.identifier === 0x04 && Buffer.isBuffer(node.contents)) {
    // TODO: add lookahead for multiple tags
    const [, rt] = decodeTag(node.contents);
    const [length, rl] = decodeLength(node.contents.slice(rt));

    if (rt + length + rl === node.contents.length) {
      const chunks = [];
      const parser = new Parser();
      parser.on('data', (chunk) => chunks.push(chunk));
      parser.on('finish', () => {
        parser.removeAllListeners();
        Array.prototype.push.apply(node.children, tree(chunks).children);
      });
      parser.read(node.contents);
    }
  }

  node.children = node.children.map((childNode) => treeForcedParser(childNode));
  return node;
}
