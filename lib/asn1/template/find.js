module.exports = find;

function find(type, number) {
  const children = type.children.slice(type.offset);

  if (children[0].tag.number === number) {
    return type.offset;
  }

  const next = children.findIndex((t) => !t.options?.optional);
  if (next === -1) {
    return -1;
  }

  if (children[next].tag.number === number) {
    return type.offset + next;
  }

  return -1;
}
