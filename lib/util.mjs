/* eslint-disable no-console */
import parse from './asn1/util/parse.mjs';
import inspect from './asn1/tree/inspect.mjs';
import noTail from './asn1/util/no_tail.mjs';

export function printBer(data, options = {}) {
  const tree = parse(data);
  if (options.noTail) {
    tree.node = noTail(tree.node);
  }

  console.log(inspect(tree.node, { depth: 20, colors: true, type: options.type }));
}
