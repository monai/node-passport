/* eslint-disable no-underscore-dangle */
const { Transform } = require('readable-stream');
const Parser = require('./parser');

class ParserStream extends Transform {
  constructor(options) {
    super({ ...options, readableObjectMode: true });

    this.parser = new Parser();

    this.onData = this.onData.bind(this);
    this.onFinish = this.onFinish.bind(this);
    this.onError = this.onError.bind(this);

    this.parser.on('data', this.onData);
    this.parser.on('finish', this.onFinish);
    this.parser.on('error', this.onError);

    this.done = undefined;
    this.doneCalled = false;
  }

  onData(data) {
    this.push(data);
  }

  onFinish() {
    if (!this.doneCalled) {
      this.doneCalled = true;
      this.done();
    }
  }

  onError(error) {
    this.teardown();
    this.doneCalled = true;
    this.done(error);
  }

  teardown() {
    this.parser.removeListener('data', this.onData);
    this.parser.removeListener('finish', this.onFinish);
    this.parser.removeListener('error', this.onFinish);
  }

  _transform(chunk, _encoding, done) {
    this.done = done;
    this.doneCalled = false;
    this.parser.read(chunk);
  }

  _flush(done) {
    this.teardown();
    this.push(null);
    done();
  }
}

module.exports = ParserStream;
