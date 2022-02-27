import Parser from '../ber/parser.mjs';
import DataValue from './data_value.mjs';

const {
  tag, length, contents, dataValueBegin, dataValueEnd,
} = Parser;
const contentComponents = [tag, length, contents];

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
