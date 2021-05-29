const find = require('./find');

module.exports = fill;

function fill(type, tree) {
  for (const child of tree.children) {
    const index = find(type, child.tag.number);

    if (child.tag.encoding === 0) {
      if (type.offset > -1) {
        type.offset = index + 1;
      }

      if (index > -1) {
        type.children[index].contents = child.contents;
      } else {
        throw new Error(`Tag ${child.tag} is missing in the template`);
      }
    } else {
      fill(type.children[index], child);
    }
  }
}
