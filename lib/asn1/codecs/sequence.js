const { inspect } = require('util');

module.exports = {
  encode,
  decode: makeDecoder('visit'),
  inspect: makeDecoder('inspect'),
};

function encode() {

}

function makeDecoder(type) {
  return (data, visitor) => {
    const out = [];
    const read = 0;

    let rd, rl,
    while (read < data.length) {
      [rd, rl] = visitor[type](data);
      read += rl;
      out.push(rd);
    }

    return out;
  }
}
