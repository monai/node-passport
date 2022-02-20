import trimEnd from '../../util/trim_end.mjs';

export default noTail;

function noTail(tree) {
  return {
    ...tree,
    children: trimEnd(tree.children, (node) => node?.tag?.number !== 0),
  };
}
