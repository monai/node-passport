class CommandApdu {
  static shortSm97 = 'short';

  static extendedSm97 = 'extended';

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

    // TODO: Handle sm97
    return new this(cla, ins, p1, p2, options);
  }

  constructor(cla, ins, p1, p2, { data, le, sm97 } = {}) {
    this.cla = cla;
    this.ins = ins;
    this.p1 = p1;
    this.p2 = p2;
    this.sm97 = sm97;

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

  toBuffer() {
    // TODO: Add check
    // 7816-4 5.2
    // In any command APDU comprising both Lc and Le fields (see ISO/IEC 7816-3),
    // short and extended length fields shall not be combined: either both of them are short,
    // or both of them are extended.
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
      return Buffer.alloc(0);
    }

    if (this.data.length < 0x100) {
      return Buffer.from([this.data.length]);
    }

    const lc = Buffer.alloc(3);
    lc.writeUInt16BE(this.data.length, 1);
    return lc;
  }

  getEncodedLe() {
    if (this.sm97 === this.constructor.shortSm97) {
      return Buffer.from([0x00]);
    }

    if (this.le > 0) {
      if (this.le < 0x100) {
        return Buffer.from([this.le]);
      }

      if (this.le === 0x100) {
        return Buffer.from([0x00]);
      }

      const extendedLc = this.data && this.data.length >= 0x100;
      const le = Buffer.alloc(extendedLc ? 2 : 3);

      const offset = extendedLc ? 0 : 1;
      if (this.le < 0x10000) {
        le.writeUInt16BE(this.le, offset);
      }
      return le;
    }

    return Buffer.alloc(0);
  }

  toString() {
    return this.toBuffer().toString('hex');
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
}

module.exports = CommandApdu;
