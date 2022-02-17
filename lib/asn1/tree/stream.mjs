/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */

import { Transform } from 'readable-stream';
import build from './build.mjs';

class TreeStream extends Transform {
  constructor(options) {
    super({ ...options, objectMode: true });
  }

  _transform(chunk, _encoding, done) {
    try {
      this.tree = build([chunk], this.tree);
      done(null);
    } catch (ex) {
      this.destroy(ex);
    }
  }

  _flush(done) {
    done(null, this.tree.node);
  }
}

export default TreeStream;
