import Parser from '../ber/parser.mjs';
import build from '../tree/build.mjs';

export default function parse(data, options) {
  return build(Parser.components(data), options);
}
