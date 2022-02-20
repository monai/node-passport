/* eslint-disable no-console */
import parse from './parse.mjs';
import noTail from './no_tail.mjs';
import inspect from '../tree/inspect.mjs';

export default function printBer(data, options = {}) {
  const tree = parse(data, options);
  if (options.noTail) {
    tree.node = noTail(tree.node);
  }

  const str = inspect(tree.node, { depth: Infinity, colors: true });
  if (str.length > 0) {
    console.log(str);
  }
}
