/* eslint-disable no-underscore-dangle */

const { Transform } = require('readable-stream');
const treeInspect = require('./tree_inspect');

class TreeInspectStream extends Transform {
  constructor(options) {
    super({ ...options, objectMode: true });

    this.options = options;
  }

  _transform(chunk, _encoding, done) {
    try {
      done(null, treeInspect(chunk, this.options));
    } catch (ex) {
      done(ex);
    }
  }
}

module.exports = TreeInspectStream;
