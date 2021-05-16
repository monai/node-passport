const Parser = require('../parser');
const tree = require('../tree');

module.exports = parse;

function parse(data) {
  let out;

  const components = [];
  const parser = new Parser();
  parser.on('data', (component) => components.push(component));
  parser.on('finish', () => {
    out = tree(components);
  });
  parser.read(data);

  return out;
}
