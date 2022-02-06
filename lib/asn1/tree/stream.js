/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */

const { Transform } = require('readable-stream');
const builder = require('./builder');

class TreeStream extends Transform {
  constructor(options) {
    super({ ...options, objectMode: true });
  }

  _transform(chunk, _encoding, done) {
    try {
      this.tree = builder([chunk], this.tree);
      done(null);
    } catch (ex) {
      this.destroy(ex);
    }
  }

  _flush(done) {
    delete this.tree.stack;
    done(null, this.tree.node);
  }
}

module.exports = TreeStream;
