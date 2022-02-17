export default function createObject(tree) {
  const out = {};

  for (const node of tree.children) {
    const { identifier } = node.tag;
    const template = tree?.template?.[identifier];

    let value;
    if (node.children.length) {
      value = createObject(node);
    } else if (template?.decode) {
      value = template.decode(node.contents);
    } else {
      value = node.contents;
    }

    out[identifier] = value;
    if (template?.name) {
      out[template.name] = value;
    }
  }

  return out;
}
