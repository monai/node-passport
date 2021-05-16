const Parser = require('./parser');

module.exports = tree;

function tree(parts, out = { components: [], children: [] }) {
  if (!out.stack) {
    out.stack = [out];
  }
  const { stack } = out;
  let current = stack[stack.length - 1];

  for (const part of parts) {
    if (part.component) {
      if (part.component === Parser.tag) {
        current.tag = part.tag;
      } else if (part.component === Parser.length) {
        current.length = part.length;
      }
      current.components.push(part);
    } else if (part.stack) {
      if (part.stack === Parser.push) {
        const previous = current;
        current = {
          components: [],
          children: [],
        };
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

  return out;
}
