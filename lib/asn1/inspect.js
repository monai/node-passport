const util = require('util');
const codecs = require('./codecs');

module.exports = inspect;

function inspect(nodes, options = {}) {
  const depth = options.__currentDepth || 0;

  const out = nodes.map(node => {
    const tag = util.inspect(node.tag);
    const depthVal = new Array(2 * depth + 1).join(' ');

    let out = `${depthVal}${tag} [${node.length}]`;

    if (node.children.length) {
      const children = inspect(node.children, { ...options, __currentDepth: depth + 1 });
      out += `\n${children}`;
    } else {
      const codec = codecs[node.tag.tagNumber];
      const value = (codec && codec.inspect) ? codec.inspect(node.contents) : node.contents.toString();

      out += ` :: ${node.contents.inspect()} ${util.inspect(value, options)}`;
    }

    return out;
  });

  return out.join('\n');
}
