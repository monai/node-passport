/* eslint-disable no-underscore-dangle */

const { Transform } = require('readable-stream');
const inspect = require('./inspect');

class TreeInspectStream extends Transform {
  constructor(options) {
    super({ ...options, objectMode: true });

    this.options = options;
  }

  _transform(chunk, _encoding, done) {
    try {
      done(null, inspect(chunk, this.options));
    } catch (ex) {
      this.destroy(ex);
    }
  }
}

module.exports = TreeInspectStream;
