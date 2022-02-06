const Parser = require('../ber/parser');
const builder = require('../tree/builder');

module.exports = parse;

function parse(data, options) {
  return builder(Parser.components(data), options);
}
