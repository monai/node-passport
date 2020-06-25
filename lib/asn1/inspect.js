const util = require('util');
const codecs = require('./codecs');
const uType = require('./type');

module.exports = inspect;

function inspect(nodes, options = {}) {
  // eslint-disable-next-line no-underscore-dangle
  const depth = options.__currentDepth || 0;
  const type = { ...uType, ...(options.type || {}) };

  const formattedNode = nodes.map((node) => {
    const tag = util.inspect(node.tag);
    const depthVal = new Array(2 * depth + 1).join(' ');

    let out = `${depthVal}${tag} [${node.length}]`;

    if (node.children.length) {
      const children = inspect(node.children, { ...options, __currentDepth: depth + 1 });
      out += `\n${children}`;
    } else {
      let value;

      try {
        const codec = codecs[node.tag.tagNumber];
        value = (codec && codec.inspect) ? codec.inspect(node.contents) : node.contents.toString();
      } catch (ex) {
        value = node.contents.toString();
      }

      out += ` ${type[node.tag.tagNumber]}`;
      out += ` :: ${node.contents.inspect()} ${util.inspect(value, options)}`;
    }

    return out;
  });

  return formattedNode.join('\n');
}
