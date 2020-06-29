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
      this.data = data;
    }

    if (typeof le === 'number') {
      if (le > 0xffff) {
        throw new RangeError(`The value of "le" is out of range. It must be >= 0 and <= 65535. Received ${le}`);
      }

      this.le = le;
    } else if (le !== undefined && le !== null) {
      throw new TypeError('The value of "le" must be of type number, null, or undefined');
    }
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
      left.push(this.data.length);
    }
    out.push(Buffer.from(left));

    if (this.data) {
      out.push(this.data);
    }

    if (this.le !== undefined) {
      if (this.le <= 0xff) {
        out.push(Buffer.from([this.le]));
      } else if (this.le <= 0xffff) {
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
