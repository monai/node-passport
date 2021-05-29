module.exports = find;

function find(type, identifier) {
  if (!type.options.ordered) {
    return type.children.findIndex((t) => t.tag.identifier === identifier);
  }

  const children = type.children.slice(type.offset);

  if (children[0].tag.identifier === identifier) {
    return type.offset;
  }

  const next = children.findIndex((t) => !t.options?.optional);
  if (next === -1) {
    return -1;
  }

  if (children[next].tag.identifier === identifier) {
    return type.offset + next;
  }

  return -1;
}
