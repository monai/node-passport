import Parser from '../ber/parser.mjs';
import builder from '../tree/builder.mjs';

export default parse;

function parse(data, options) {
  return builder(Parser.components(data), options);
}
