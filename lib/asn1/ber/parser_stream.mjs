/* eslint-disable no-underscore-dangle */
import { Transform } from 'readable-stream';
import Parser from './parser.mjs';

class ParserStream extends Transform {
  constructor(options) {
    super({ ...options, readableObjectMode: true });

    this.parser = new Parser();

    this.onData = this.onData.bind(this);
    this.onError = this.onError.bind(this);

    this.parser.on('data', this.onData);
    this.parser.on('error', this.onError);
  }

  onData(data) {
    this.push(data);
  }

  onError(error) {
    this.teardown();
    this.destroy(error);
  }

  teardown() {
    this.parser.removeListener('data', this.onData);
    this.parser.removeListener('error', this.onError);
  }

  _transform(chunk, _encoding, done) {
    this.parser.read(chunk);
    done();
  }

  _flush(done) {
    this.teardown();
    done();
  }
}

export default ParserStream;
