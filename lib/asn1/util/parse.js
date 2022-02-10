import Parser from '../ber/parser.js';
import builder from '../tree/builder.js';

export default parse;

function parse(data, options) {
  return builder(Parser.components(data), options);
}
