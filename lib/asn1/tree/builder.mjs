import Parser from '../ber/parser.mjs';

function makeNode() {
  return {
    components: [],
    children: [],
  };
}

export default builder;

const {
  tag, length, contents, dataValueBegin, dataValueEnd,
} = Parser;
const contentComponents = [tag, length, contents];

function builder(parts, options = {}) {
  options = { ...options };

  if (!options.node) {
    options.node = makeNode();
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

      const previous = stack[stack.length - 2];
      const template = previous?.template?.[current.tag.identifier];
      if (template?.children) {
        current.template = template.children;
      }
    } else if (part.component === length) {
      current.length = part.length;
    } else if (part.component === dataValueBegin) {
      const previous = current;
      current = makeNode();
      stack.push(current);
      previous.children.push(current);
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
      current = stack[stack.length - 1];
    }
  }

  return options;
}
