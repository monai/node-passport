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

    if (!node.tag) {
      return undefined;
    }

    let out = `${depthVal}${node.tag.toDebugString()} l:${node.length}`;
    out += ' ';
    if (type[node.tag.identifier]) {
      out += type[node.tag.identifier];
    } else if (nodes?.template?.[node.tag.identifier]) {
      out += nodes?.template?.[node.tag.identifier]?.description;
    } else {
      out += `[${node.tag.number}]`;
    }

    if (node.children.length) {
      const children = treeInspect(node, { ...options, __currentDepth: depth + 1 });
      if (children.length) {
        out += `\n${children}`;
      }
    } else {
      const codec = codecs[node.tag.identifier];
      const value = codec && node.contents
        ? codec.inspect(node.contents)
        : node?.contents?.toString();

      const valueString = [
        node?.contents?.inspect(),
        inspect(value, options),
      ].filter(Boolean);

      out += ` :: ${valueString.join(' ')}`;
    }

    return out;
  });

  return formattedNode.filter(Boolean).join('\n');
}
