const { decode: decodeTag } = require('./tag');
const { decode: decodeLength } = require('./length');

module.exports = parse;

function* parse(data) {
  do {
    const [tag, tl] = decodeTag(data);
    data = data.slice(tl);

    const [length, ll] = decodeLength(data);
    data = data.slice(ll);

    const value = data.slice(0, length);
    data = data.slice(length);

    yield [tag, value];
  } while (data.length);
}
