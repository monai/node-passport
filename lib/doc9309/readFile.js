const { CommandAPDU } = require('./apdu');
const { decode: decodeLength } = require('../asn1/length');
const { Readable } = require('stream');
const { Iso7816Error } = require('../iso7816.js');

class ReadStream extends Readable {
  fileSelected = false
  headerRead = false
  bodyLength = -1
  bodyRead = 0;

  constructor(options) {
    options = {
      highWaterMark: 0xe0,
      offset: 0,
      ...options,
    };
    super(options);
    Object.assign(this, options);
  }

  async selectFile() {
    if (this.mode === 'sfi') {
      this.offset = (0x80 ^ this.sfi) << 8;
      this.fileSelected = true;
    } else if (this.mode === 'select') {
      const res = await selectFile(sreader, fileId);
      if (!res.noError()) {
        throw new Iso7816Error(res.sw);
      }

      this.fileSelected = true;
    }
  }

  async readHeader() {
    const res = await readBinary(this.sreader, this.offset, 4);
    if (!res.noError()) {
      throw new Iso7816Error(res.sw);
    }
    const [bodyLength, o] = decodeLength(res.data.slice(1));

    this.bodyLength = bodyLength;
    this.offset = o + 1;
    this.headerRead = true;

    return res.data.slice(0, this.offset);
  }

  async _read(size) {
    if (!this.fileSelected) {
      await this.selectFile();
    }
    if (!this.headerRead) {
      const header = await this.readHeader();
      return this.push(header);
    }

    if (this.bodyRead >= this.bodyLength) {
      return this.push(null);
    }

    const le = Math.min(this.bodyLength - this.bodyRead, size);
    const res = await readBinary(this.sreader, this.offset, le);
    if (!res.noError()) {
      throw new Iso7816Error(res.sw);
    }
    const length = res.data.length;

    if (res.noError()) {
      this.bodyRead += length;
      this.offset += length;
      this.push(res.data);
    } else {
      throw new Iso7816Error(res.sw);
    }
  }
}

function createReadStream(options) {
  options = Object.assign({
    mode: 'sfi',
    offset: 0,
  }, options);
  if ( ! options.mode in ['sfi', 'select']) {
    throw new Error(`unknown mode ${options.mode}`);
  }

  return new ReadStream(options);
}

function selectFile(sreader, fileId) {
  const apdu = new CommandAPDU(0x00, 0xa4, 0x02, 0x0c, { data: fileId });
  return this.sreader.transmit(apdu, 16);
}

function readBinary(sreader, offset, le) {
  const p1 = offset >>> 8;
  const p2 = offset & 0xff;
  const apdu = new CommandAPDU(0x00, 0xb0, p1, p2, { le });

  return sreader.transmit(apdu, 0xff);
}

module.exports = {
  createReadStream,
  ReadStream,
  selectFile,
  readBinary,
};
