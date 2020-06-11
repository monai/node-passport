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
      this.sw1 = data.slice(-2, -1)[0];
      this.sw2 = data.slice(-1)[0];
      this.data = data.slice(0, -2);
    }
  }

  toBuffer() {
    return this.data;
  }

  noError() {
    return this.sw.equals(this.constructor.noError);
  }
}

module.exports = ResponseApdu;
