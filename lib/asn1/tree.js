const Parser = require('./parser');

function makeNode() {
  return {
    components: [],
    children: [],
  };
}

module.exports = tree;

function tree(parts, options = {}) {
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
    if (part.component) {
      if (part.component === Parser.tag) {
        current.tag = part.tag;

        const parent = stack[stack.length - 2];
        const template = parent?.template?.[current.tag.identifier];
        if (template?.children) {
          current.template = template.children;
        }
      } else if (part.component === Parser.length) {
        current.length = part.length;
      }
      current.components.push(part);
    } else if (part.stack) {
      if (part.stack === Parser.push) {
        const previous = current;
        current = makeNode();
        stack.push(current);
        previous.children.push(current);
      } else if (part.stack === Parser.pop) {
        const contentsComponents = current.components
          .filter((c) => c.component === Parser.contents)
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
  }

  return options;
}
