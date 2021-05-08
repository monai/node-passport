/* eslint-disable no-underscore-dangle */

const { Transform } = require('readable-stream');
const treeForcedParser = require('./tree_forced_parser');

class TreeForcedParserStream extends Transform {
  constructor(options) {
    super({ ...options, objectMode: true });
  }

  _transform(chunk, _encoding, done) {
    try {
      done(null, treeForcedParser(chunk));
    } catch (ex) {
      done(ex);
    }
  }
}

module.exports = TreeForcedParserStream;
