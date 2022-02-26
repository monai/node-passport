import util from 'util';
import encoding from '../encoding.mjs';
import Parser from '../ber/parser.mjs';
import codecs from '../codecs/index.mjs';
import universalType from '../type.mjs';

const {
  tag, length, contents, dataValueBegin, dataValueEnd,
} = Parser;
const contentComponents = [tag, length, contents];

export class DataValue {
  constructor(parent) {
    if (parent) {
      this.parent = parent;
    }
    this.components = [];
    this.children = [];
  }

  set tag(value) {
    super.tag = value;

    const template = this.dataObject?.children;
    if (template) {
      this.template = template;
    }
  }

  get dataObject() {
    return this.parent?.template?.[this.tag.identifier];
  }

  get [Symbol.toStringTag]() {
    return this?.tag?.[Symbol.toStringTag];
  }

  [util.inspect.custom](_depth, options) {
    const ctx = {
      indentLength: 2,
      options,
    };

    return format(ctx, this, 0);
  }
}

export default function build(parts, options = {}) {
  options = { ...options };

  if (!options.node) {
    options.node = new DataValue();
  }
  if (!options.stack) {
    options.stack = [options.node];
  }

  const { stack } = options;
  let current = stack[stack.length - 1];

  if (options.template) {
    current.template = options.template;
  }

  for (const part of parts) {
    if (contentComponents.includes(part.component)) {
      current.components.push(part);
    }

    if (part.component === tag) {
      current.tag = part.tag;
    } else if (part.component === length) {
      current.length = part.length;
    } else if (part.component === dataValueBegin) {
      const parent = current;
      current = new DataValue(parent);
      stack.push(current);
      parent.children.push(current);
    } else if (part.component === dataValueEnd) {
      const contentsComponents = current.components
        .filter((c) => c.component === contents)
        .map((c) => c.contents);
      if (contentsComponents.length) {
        current.contents = Buffer.concat(contentsComponents);
      }

      current.data = Buffer.concat([
        current.components[0].data,
        current.components[1].data,
        current.contents,
      ].filter(Boolean));

      stack.pop();
      current = current.parent;
    }
  }

  return options;
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
    if (typeof dataObject.description === 'function') {
      description = dataObject.description(node);
    } else {
      description = dataObject.description;
    }
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
    node.contents && util.inspect(node.contents, options),
    util.inspect(value, options).replace(/\n/g, `\n${indent}`),
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
