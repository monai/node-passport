const Parser = require('../ber/parser');
const builder = require('../tree/builder');
const noTail = require('./no_tail');

module.exports = {
  parse,
  parseNoTail,
};

function parse(data, options) {
  return builder(Parser.components(data), options);
}

function parseNoTail(data, options) {
  return noTail(parse(data, options));
}
