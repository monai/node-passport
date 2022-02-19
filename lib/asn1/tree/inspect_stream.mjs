/* eslint-disable no-underscore-dangle */

import { Transform } from 'stream';
import inspect from './inspect.mjs';

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
