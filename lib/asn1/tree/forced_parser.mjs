import { decode as decodeTag } from '../ber/tag.mjs';
import { decode as decodeLength } from '../ber/length.mjs';
import parse from '../util/parse.mjs';
import LengthError from '../length_error.mjs';

export default forcedParser;

function forcedParser(node, template) {
  if (node.tag) {
    const { tag, contents, children } = node;
    const { identifier } = tag;
    const force = template?.[identifier]?.force;

    if (force || (identifier === 0x04 && Buffer.isBuffer(contents))) {
      try {
        const [, rt] = decodeTag(contents);
        const [length, rl] = decodeLength(contents.slice(rt));

        if (rt + length + rl <= contents.length) {
          Array.prototype.push.apply(children, parse(contents).node.children);
        }
      } catch (ex) {
        if (!(ex instanceof LengthError || ex instanceof RangeError)) {
          throw ex;
        }
      }
    }
  }

  const children = node.children.map((childNode) => forcedParser(childNode, node.template));
  return { ...node, children };
}
