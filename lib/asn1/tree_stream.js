/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */

const { Transform } = require('readable-stream');
const tree = require('./tree');

class TreeStream extends Transform {
  constructor(options) {
    super({ ...options, objectMode: true });
  }

  _transform(chunk, _encoding, done) {
    try {
      this.tree = tree([chunk], this.tree);
      done(null);
    } catch (ex) {
      done(ex);
    }
  }

  _flush(done) {
    delete this.tree.stack;
    done(null, this.tree.node);
  }
}

module.exports = TreeStream;
