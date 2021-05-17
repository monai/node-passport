/* eslint-disable no-await-in-loop */
const { Readable } = require('readable-stream');
const readBinary = require('./read_binary');

class ReadBinaryStream extends Readable {
  static defaults = {
    le: 0x100,
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
    const le = Math.min(size, this.length ? this.length - this.offset : Infinity, this.le);
    if (le === 0) {
      setImmediate(() => this.push(null));
    }

    readBinary(this.reader, this.offset, le)
      .then((res) => {
        if (res.noError()) {
          return res;
        }
        // 7816-4 Table 6
        // End of file or record reached before reading Ne bytes, or unsuccessful search.
        if (res.sw1[0] === 0x62 && res.sw2[0] === 0x82 && res.data.length > 0) {
          return res;
        }
        // 7816-4 Table 5
        // Wrong Le field; SW2 encodes the exact number of available data bytes.
        if (res.sw1[0] === 0x6c) {
          return readBinary(this.reader, this.offset, res.sw2[0]);
        }
        return res;
      })
      .then((res) => {
        if (res.data) {
          this.push(res.data);
        }

        if (res.noError()) {
          // 7816-4 11.2.3
          // The response data field gives (part of) the content of an EF supporting data units.
          // If the Le field contains only bytes set to '00', then all the bytes until the end of
          // the file should be read within the limit of 256 for a short Le field,
          // or 65 536 for an extended Le field.
          if (le === 0x100 || le === 0x10000) {
            this.push(null);
          } else {
            this.offset += le;
          }
        } else {
          this.push(null);

          if (this.length && !res.noError()) {
            this.destroy(res.toError());
          }
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
