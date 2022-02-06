/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */

const { Transform } = require('readable-stream');
const treeForcedParser = require('./forced_parser');

class TreeForcedParserStream extends Transform {
  constructor(options) {
    super({ ...options, objectMode: true });
  }

  _transform(chunk, _encoding, done) {
    try {
      done(null, treeForcedParser(chunk));
    } catch (ex) {
      this.destroy(ex);
    }
  }
}

module.exports = TreeForcedParserStream;
