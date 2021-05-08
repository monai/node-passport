const { inspect } = require('util');
const codecs = require('./codecs');
const uType = require('./type');

module.exports = treeInspect;

function treeInspect(nodes, options = {}) {
  // eslint-disable-next-line no-underscore-dangle
  const depth = options.__currentDepth || 0;
  const type = { ...uType, ...(options.type || {}) };

  const formattedNode = nodes.children.map((node) => {
    const depthVal = new Array(2 * depth + 1).join(' ');

    let out = `${depthVal}${node.tag.toDebugString()} l:${node.length}`;
    out += ' ';
    out += type[node.tag.identifier] ?? `[${node.tag.number}]`;

    if (node.children.length) {
      const children = treeInspect(node, { ...options, __currentDepth: depth + 1 });
      out += `\n${children}`;
    } else {
      let value;

      try {
        const codec = codecs[node.tag.identifier];
        value = codec?.inspect ? codec.inspect(node.contents) : node.contents.toString();
      } catch (ex) {
        value = node.contents.toString();
      }

      out += ` :: ${node.contents.inspect()} ${inspect(value, options)}`;
    }

    return out;
  });

  return formattedNode.join('\n');
}
