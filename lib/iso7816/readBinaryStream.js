/* eslint-disable no-await-in-loop */
const { Readable } = require('readable-stream');
const readBinary = require('./readBinary');

class ReadBinaryStream extends Readable {
  static defaults = {
    le: 0x00,
  };

  constructor(reader, options) {
    super(options);

    options = { ...this.constructor.defaults, ...options };
    this.reader = reader;
    this.le = options.le;
    this.length = options.length;
    this.offset = options.offset || 0;
  }

  // eslint-disable-next-line no-underscore-dangle
  _read(size) {
    const le = Math.min(size, this.le);

    readBinary(this.reader, this.offset, le)
      .then((res) => {
        if (res.noError()) {
          return Promise.resolve(res);
        }
        if (res.sw1[0] === 0x6c) {
          return readBinary(this.reader, this.offset, res.sw2[0]);
        }
        return res;
      })
      .then((res) => {
        if (res.noError()) {
          this.push(res.data);
          this.offset += le;
        } else if (!this.length) {
          this.push(null);
        } else {
          this.destroy(res.toError());
        }
      }, (error) => {
        this.destroy(error);
      });
  }
}

module.exports = {
  ReadBinaryStream,
  createReadStream,
};

function createReadStream(reader, options) {
  return new ReadBinaryStream(reader, options);
}
