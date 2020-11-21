const util = require('util');

class CommandApdu {
  static short = 'short';

  static extended = 'extended';

  static from(data) {
    if (typeof data === 'string') {
      data = Buffer.from(data, 'hex');
    }

    if (data.length < 4) {
      throw new RangeError(`The length of "data" is out of range. It must be >= 4. Received ${data.length}`);
    }

    let offset = 0;

    const [cla, ins, p1, p2] = data;
    offset += 4;

    let lc;
    let cdata;
    let le = 0;
    if (data.length > 5 && data[offset] === 0x00) {
      // extended
      offset += 1;
      if (data.length - offset > 2) {
        lc = data.slice(offset).readUInt16BE();
        offset += 2;

        cdata = data.slice(offset, offset + lc);
        offset += lc;
      }

      if (data.length - offset === 2) {
        le = data.slice(offset).readUInt16BE();
        le = le === 0 ? 0x10000 : le;
      }
    } else if (data.length > 4) {
      // short
      if (data.length - offset > 1) {
        lc = data.slice(offset).readUInt8();
        offset += 1;

        cdata = data.slice(offset, offset + lc);
        offset += lc;
      }

      if (data.length - offset === 1) {
        le = data.slice(offset).readUInt8();
        le = le === 0 ? 0x100 : le;
      }
    }

    const options = {};
    if (cdata) {
      options.data = cdata;
    }
    if (le !== undefined) {
      options.le = le;
    }

    return new this(cla, ins, p1, p2, options);
  }

  constructor(cla, ins, p1, p2, { data, le, sm } = {}) {
    this.cla = cla;
    this.ins = ins;
    this.p1 = p1;
    this.p2 = p2;

    if (cla & 0x0c || sm) {
      this.sm = true;
    }

    if (data) {
      if (typeof data === 'string') {
        data = Buffer.from(data, 'hex');
      }

      if (data.length > 0xffff) {
        throw new RangeError(`The length of "data" is out of range. It must be >= 0 and <= 65535. Received ${data.length}`);
      }

      this.data = data;
    }

    if (le > 0x10000) {
      throw new RangeError(`The value of "le" is out of range. It must be >= 0 and <= 65536. Received ${le}`);
    }

    this.le = le;
  }

  // 7816-4 5.2
  // In any command APDU comprising both Lc and Le fields (see ISO/IEC 7816-3),
  // short and extended length fields shall not be combined: either both of them are short,
  // or both of them are extended.
  get fieldLength() {
    const { extended, short } = this.constructor;
    return (this?.data?.length > 0xff || this.le > 0x100) ? extended : short;
  }

  get shortField() {
    return this.fieldLength === this.constructor.short;
  }

  get extendedField() {
    return this.fieldLength === this.constructor.extended;
  }

  toBuffer() {
    return Buffer.concat([
      this.getEncodedHeader(),
      this.getEncodedLc(),
      this.data,
      this.getEncodedLe(),
    ].filter(Boolean));
  }

  getEncodedHeader() {
    return Buffer.from([
      this.cla,
      this.ins,
      this.p1,
      this.p2,
    ]);
  }

  getEncodedLc() {
    if (!this.data) {
      return null;
    }

    if (this.shortField) {
      return Buffer.from([this.data.length]);
    }

    const lc = Buffer.alloc(3);
    lc.writeUInt16BE(this.data.length, 1);
    return lc;
  }

  getEncodedLe() {
    if (this.sm) {
      return Buffer.alloc(this.data ? 2 : 3);
    }

    if (this.le > 0) {
      if (this.shortField) {
        if (this.le < 0x100) {
          return Buffer.from([this.le]);
        }

        if (this.le === 0x100) {
          return Buffer.from([0x00]);
        }
      }

      const le = Buffer.alloc(this.data ? 2 : 3);
      const offset = this.data ? 0 : 1;
      if (this.le < 0x10000) {
        le.writeUInt16BE(this.le, offset);
      }
      return le;
    }

    return null;
  }

  toString() {
    return this.toBuffer().toString('hex');
  }

  toDebugString() {
    return [
      this[Symbol.toStringTag],
      this.data && this.data.toString('hex'),
    ].filter(Boolean).join(' ');
  }

  get [Symbol.toStringTag]() {
    const out = [this.getEncodedHeader().toString('hex')];

    if (this.data) {
      out.push(`lc:${this.getEncodedLc().toString('hex')}`);
    }

    if (this.le) {
      out.push(`le:${this.getEncodedLe().toString('hex')}`);
    }

    return out.join(' ');
  }

  [util.inspect.custom]() {
    return `<${this.constructor} ${this.toDebugString()}>`;
  }
}

module.exports = CommandApdu;
