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

class ResponseApdu {
  static noError = Buffer.from([0x90, 0x00]);

  constructor(data, sw1, sw2) {
    this._data = data;

    if (sw1 && sw2) {
      this.data = data;
      this.sw = Buffer.concat([sw1, sw2]);
      this.sw1 = sw1;
      this.sw2 = sw2;
    } else {
      this.sw = data.slice(-2);
      this.sw1 = data.slice(-2, -1);
      this.sw2 = data.slice(-1);
      this.data = data.slice(0, -2);
    }
  }

  toBuffer() {
    return this._data;
  }

  noError() {
    return this.sw.equals(this.constructor.noError);
  }
}

module.exports = {
  CommandApdu,
  ResponseApdu,
};
