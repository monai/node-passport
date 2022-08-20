/* eslint-disable no-console */
import { inspect } from 'util';
import parse from './parse.mjs';
import forcedParser from '../tree/forced_parser.mjs';

export default function printBer(data, options = {}) {
  const tree = parse(data, options);
  if (options.noTail) {
    tree.node.trimEnd();
  }
  tree.node = forcedParser(tree.node);

  const str = inspect(tree.node, { depth: Infinity, colors: true });
  if (str.length > 0) {
    console.log(str);
  }
}
