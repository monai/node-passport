const Parser = require('../ber/parser');
const builder = require('../tree/builder');

module.exports = parse;

function parse(data, options) {
  let out;

  const components = [];
  const parser = new Parser();
  parser.on('data', (component) => components.push(component));
  parser.on('finish', () => {
    out = builder(components, options);
  });
  parser.read(data);

  return out;
}
