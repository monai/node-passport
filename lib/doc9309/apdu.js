class APDU {
  constructor(cla, ins, p1, p2, { data, le }) {
    this.cla = cla;
    this.ins = ins;
    this.p1 = p1;
    this.p2 = p2;

    if (data) {
      this.data = data;
    }

    if (le !== undefined) {
      this.le = le;
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
      out.push(Buffer.from([this.le]));
    }

    return Buffer.concat(out);
  }
}

module.exports = APDU;
