import { inspect as utilInspect } from 'util';
import codecs from '../codecs/index.mjs';
import universalType from '../type.mjs';

export default function inspect(nodes, options = {}) {
  // eslint-disable-next-line no-underscore-dangle
  const depth = options.__currentDepth || 0;
  const formattedNode = nodes.children.map((node) => {
    if (!node.tag) {
      return undefined;
    }
    const { identifier, number } = node.tag;

    const indent = new Array(2 * depth + 1).join(' ');
    const template = nodes?.template?.[identifier];

    let out = `${indent}${node.tag.toDebugString()} l:${node.length}`;
    out += ' ';
    if (template) {
      if (typeof template.description === 'function') {
        out += template.description(node);
      } else {
        out += template.description;
      }
    } else if (universalType[identifier]) {
      out += universalType[identifier];
    } else {
      out += `[${number}]`;
    }

    if (node.children.length) {
      const children = inspect(node, {
        ...options,
        template: template?.children ?? {},
        __currentDepth: depth + 1,
      });
      if (children.length) {
        out += `\n${children}`;
      }
    } else {
      let inspector;
      if (template?.inspect) {
        inspector = template.inspect;
      } else if (template?.decode) {
        inspector = template.decode;
      } else if (identifier in codecs) {
        inspector = codecs[identifier].inspect;
      } else {
        inspector = toString;
      }

      const value = Buffer.isBuffer(node.contents) ? inspector(node.contents) : node.contents;
      const valueString = [
        node.contents && utilInspect(node.contents, options),
        utilInspect(value, options).replace(/\n/g, `\n${indent}`),
      ].filter(Boolean);

      out += ` :: ${valueString.join(' ')}`;
    }

    return out;
  });

  return formattedNode.filter(Boolean).join('\n');
}

function toString(obj) {
  return obj.toString();
}
