class CommandApdu {
  constructor(cla, ins, p1, p2, { data, le } = {}) {
    this.cla = cla;
    this.ins = ins;
    this.p1 = p1;
    this.p2 = p2;

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
    const out = [
      Buffer.from([this.cla, this.ins, this.p1, this.p2]),
    ];

    if (this.data) {
      if (this.data.length < 0x100) {
        out.push(Buffer.from([this.data.length]));
      } else {
        const lc = Buffer.alloc(3);
        lc.writeUInt16BE(this.data.length, 1);
        out.push(lc);
      }

      out.push(this.data);
    }

    if (this.le > 0) {
      if (this.le < 0x100) {
        out.push(Buffer.from([this.le]));
      } else if (this.le === 0x100) {
        out.push(Buffer.from([0x00]));
      } else {
        const extendedLc = this.data && this.data.length >= 0x100;
        const le = Buffer.alloc(extendedLc ? 2 : 3);

        const offset = extendedLc ? 0 : 1;
        if (this.le < 0x10000) {
          le.writeUInt16BE(this.le, offset);
        }
        out.push(le);
      }
    }

    return Buffer.concat(out);
  }
}

module.exports = CommandApdu;
