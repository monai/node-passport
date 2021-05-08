module.exports = tree;

const push = 'push';
const pop = 'pop';
const tag = 'tag';
const length = 'length';
const contents = 'contents';

function tree(parts, out = { components: [], children: [] }) {
  if (!out.stack) {
    out.stack = [out];
  }
  const { stack } = out;
  let current = stack[stack.length - 1];

  for (const part of parts) {
    if (part.component) {
      if (part.component === tag) {
        current.tag = part.tag;
      } else if (part.component === length) {
        current.length = part.length;
      }
      current.components.push(part);
    } else if (part.stack) {
      if (part.stack === push) {
        const previous = current;
        current = {
          components: [],
          children: [],
        };
        stack.push(current);
        previous.children.push(current);
      } else if (part.stack === pop) {
        const contentsComponents = current.components
          .filter((c) => c.component === contents)
          .map((c) => c.contents);
        if (contentsComponents.length) {
          current.contents = Buffer.concat(contentsComponents);
        }

        stack.pop();
        current = stack[stack.length - 1];
      }
    }
  }

  return out;
}
