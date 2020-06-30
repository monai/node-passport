class CommandApdu {
  constructor(cla, ins, p1, p2, { data, le }) {
    this.cla = cla;
    this.ins = ins;
    this.p1 = p1;
    this.p2 = p2;

    if (data) {
      if (typeof data === 'string') {
        data = Buffer.from(data, 'hex');
      }

      if (data.lenth > 0xffff) {
        throw new RangeError(`The length of "data" is out of range. It must be >= 0 and <= 65535. Received ${data.length}`);
      }

      this.data = data;
    }

    if (typeof le === 'number' && le > 0xffff) {
      throw new RangeError(`The value of "le" is out of range. It must be >= 0 and <= 65535. Received ${le}`);
    }

    this.le = le;
  }

  toBuffer() {
    const out = [];
    const left = [
      this.cla,
      this.ins,
      this.p1,
      this.p2,
    ];

    if (this.data) {
      if (this.data.length <= 0xff) {
        left.push(this.data.length);
      } else {
        const lc = Buffer.alloc(3);
        lc.writeUInt16BE(this.data.length, 1);
        left.push(lc);
      }
    }
    out.push(Buffer.from(left));

    if (this.data) {
      out.push(this.data);
    }

    if (Buffer.isBuffer(this.le)) {
      out.push(this.le);
    } else if (this.le !== undefined) {
      if (this.le <= 0xff) {
        out.push(Buffer.from([this.le]));
      } else {
        const le = Buffer.alloc(this.data ? 2 : 3);
        const offset = this.data ? 0 : 1;
        le.writeUInt16BE(this.le, offset);
        out.push(le);
      }
    }

    return Buffer.concat(out);
  }
}

module.exports = CommandApdu;
