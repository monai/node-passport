import { decode as decodeTag } from '../ber/tag.js';
import { decode as decodeLength } from '../ber/length.js';
import parse from '../util/parse.js';
import LengthError from '../length_error.js';

export default forcedParser;

function forcedParser(node) {
  if (node.tag && node.tag.identifier === 0x04 && Buffer.isBuffer(node.contents)) {
    try {
      const [, rt] = decodeTag(node.contents);
      const [length, rl] = decodeLength(node.contents.slice(rt));

      if (rt + length + rl <= node.contents.length) {
        Array.prototype.push.apply(node.children, parse(node.contents).node.children);
      }
    } catch (ex) {
      if (!(ex instanceof LengthError || ex instanceof RangeError)) {
        throw ex;
      }
    }
  }

  const children = node.children.map((childNode) => forcedParser(childNode));
  return { ...node, children };
}
