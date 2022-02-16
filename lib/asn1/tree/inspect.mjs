import { inspect } from 'util';
import codecs from '../codecs/index.mjs';
import universalType from '../type.mjs';

export default treeInspect;

function treeInspect(nodes, options = {}) {
  // eslint-disable-next-line no-underscore-dangle
  const depth = options.__currentDepth || 0;
  const type = { ...universalType, ...(options.type || {}) };
  const template = options.template || {};

  const formattedNode = nodes.children.map((node) => {
    if (!node.tag) {
      return undefined;
    }

    const depthVal = new Array(2 * depth + 1).join(' ');
    const nodeTemplate = template[node.tag.identifier];

    let out = `${depthVal}${node.tag.toDebugString()} l:${node.length}`;
    out += ' ';
    if (nodeTemplate) {
      out += nodeTemplate.description;
    } else if (type[node.tag.identifier]) {
      out += type[node.tag.identifier];
    } else {
      out += `[${node.tag.number}]`;
    }

    if (node.children.length) {
      const children = treeInspect(node, {
        ...options,
        template: nodeTemplate?.children ?? {},
        __currentDepth: depth + 1,
      });
      if (children.length) {
        out += `\n${children}`;
      }
    } else {
      let inspector;
      if (nodeTemplate?.inspect) {
        inspector = nodeTemplate.inspect;
      } else if (nodeTemplate?.decode) {
        inspector = nodeTemplate.decode;
      } else if (node.tag.identifier in codecs) {
        inspector = codecs[node.tag.identifier].inspect;
      } else {
        inspector = (contents) => contents?.toString();
      }

      const value = Buffer.isBuffer(node.contents) ? inspector(node.contents) : node.contents;
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
