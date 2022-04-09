import { inspect } from 'util';
import encoding from '../encoding.mjs';
import codecs from '../codecs/index.mjs';
import universalType from '../type.mjs';
import trimEnd from '../../util/trim_end.mjs';

export default class DataValue {
  constructor(parent) {
    if (parent) {
      this.parent = parent;
    }
    this.components = [];
    this.children = [];
  }

  setTag(value) {
    this.tag = value;
  }

  setLength(length) {
    this.length = length;
  }

  setContents(contents) {
    this.contents = contents;
  }

  setTemplate(template) {
    for (const child of this.children) {
      const id = child.tag.identifier;
      let childTemplate = template?.[id];

      if (typeof childTemplate === 'function') {
        childTemplate = childTemplate(child);
        template[id] = childTemplate;
      }

      if (childTemplate) {
        child.setTemplate(childTemplate.children);
      }
    }

    this.template = template;
  }

  get dataObject() {
    return this.parent?.template?.[this.tag?.identifier];
  }

  get [Symbol.toStringTag]() {
    return this?.tag?.[Symbol.toStringTag];
  }

  [inspect.custom](_depth, options) {
    const ctx = {
      indentLength: 2,
      options,
    };

    return format(ctx, this, 0);
  }

  noTail() {
    this.children = trimEnd(this.children, (node) => node?.tag?.number !== 0);
    return this;
  }

  toObject() {
    if (this.children.length > 0) {
      const out = {};

      for (const node of this.children) {
        const { dataObject } = node;
        if (dataObject?.name) {
          out[dataObject.name] = node.toObject();
        }
      }

      return out;
    }

    const { dataObject } = this;
    if (dataObject?.decode) {
      return dataObject.decode(this.contents);
    }

    return this.contents;
  }
}

function format(ctx, node, currentDepth) {
  const { options, indentLength } = ctx;
  const { dataObject } = node;

  let childrenString;
  if (node.children.length) {
    const nextDepth = node.tag ? currentDepth + 1 : currentDepth;
    childrenString = node.children.map((child) => format(ctx, child, nextDepth)).join('\n');
  }

  if (!node.tag) {
    return childrenString;
  }

  let description;
  if (dataObject) {
    description = dataObject.description;
  } else if (universalType[node.tag.identifier]) {
    description = universalType[node.tag.identifier];
  } else {
    description = `[${node.tag.number}]`;
  }

  let inspector;
  if (dataObject?.inspect) {
    inspector = dataObject.inspect;
  } else if (dataObject?.decode) {
    inspector = dataObject.decode;
  } else if (node.identifier in codecs) {
    inspector = codecs[node.identifier].inspect;
  } else {
    inspector = toString;
  }

  const indent = ' '.repeat(currentDepth * indentLength);

  const tagString = `${indent}${node.tag.toDebugString()} l:${node.length} ${description}`;

  const value = Buffer.isBuffer(node.contents) ? inspector(node.contents) : node.contents;
  const valueString = [
    node.contents && inspect(node.contents, options),
    inspect(value, options).replace(/\n/g, `\n${indent}`),
  ].filter(Boolean).join(' ');

  const primitive = node.tag.encoding === encoding.primitive;
  const out = [
    tagString,
    primitive && ' :: ',
    primitive && valueString,
    childrenString && '\n',
    childrenString,
  ].filter(Boolean).join('');

  return out;
}

function toString(obj) {
  return obj.toString();
}
