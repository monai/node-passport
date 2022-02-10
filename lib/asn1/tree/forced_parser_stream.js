/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */

import { Transform } from 'readable-stream';
import forcedParser from './forced_parser.js';

class TreeForcedParserStream extends Transform {
  constructor(options) {
    super({ ...options, objectMode: true });
  }

  _transform(chunk, _encoding, done) {
    try {
      done(null, forcedParser(chunk));
    } catch (ex) {
      this.destroy(ex);
    }
  }
}

export default TreeForcedParserStream;
