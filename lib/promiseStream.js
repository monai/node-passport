const { Writable } = require('readable-stream');

class PromiseStream extends Writable {
  constructor(options) {
    super(options);

    this.buffer = [];
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }

  // eslint-disable-next-line no-underscore-dangle
  _write(chunk, encoding, done) {
    this.buffer.push(Buffer.from(chunk, encoding));
    done();
  }

  // eslint-disable-next-line no-underscore-dangle
  _destroy(error, done) {
    this.reject(error);
    done(error);
  }

  // eslint-disable-next-line no-underscore-dangle
  _final(done) {
    this.resolve(Buffer.concat(this.buffer));
    done();
  }
}

module.exports = {
  PromiseStream,
  createPromise,
};

function createPromise(options) {
  return new PromiseStream(options);
}
