export default noTail;

function noTail(tree) {
  const children = tree
    .children
    .slice()
    .reverse()
    .reduce((acc, node) => {
      if (acc.length || node.tag.number !== 0) {
        acc.push(node);
      }
      return acc;
    }, [])
    .reverse();

  return { ...tree, children };
}
