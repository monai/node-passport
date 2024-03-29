/* eslint-disable no-underscore-dangle */

import { inspect } from 'util';
import { Transform } from 'stream';

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

export default TreeInspectStream;
