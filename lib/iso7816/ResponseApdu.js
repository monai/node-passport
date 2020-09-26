class ResponseApdu {
  static noError = Buffer.from([0x90, 0x00]);

  constructor(data, sw1, sw2) {
    this.data = data;

    if (Buffer.isBuffer(sw1) && sw1.length === 2) {
      this.sw = sw1;
      this.sw1 = this.sw.slice(0, 1);
      this.sw2 = this.sw.slice(1, 2);
    } else if (Buffer.isBuffer(sw1) && Buffer.isBuffer(sw2)) {
      this.sw1 = sw1.slice(0, 1);
      this.sw2 = sw2.slice(0, 1);
      this.sw = Buffer.concat([this.sw1, this.sw2]);
    } else if (typeof sw1 === 'number' && sw1 >= 0xff && sw1 <= 0xffff) {
      this.sw1 = Buffer.from([sw1 >>> 8]);
      this.sw2 = Buffer.from([sw1 & 0xff]);
      this.sw = Buffer.concat([this.sw1, this.sw2]);
    } else if (typeof sw1 === 'number' && typeof sw2 === 'number') {
      this.sw1 = Buffer.from([sw1]);
      this.sw2 = Buffer.from([sw2]);
      this.sw = Buffer.concat([this.sw1, this.sw2]);
    } else if (Buffer.isBuffer(data)) {
      if (data.length < 2) {
        throw new RangeError(`The length of value "data" is out of range. It must be >= 2. Reveived ${data.length}`);
      }

      this.sw = data.slice(-2);
      this.sw1 = this.sw.slice(0, 1);
      this.sw2 = this.sw.slice(1, 2);
      this.data = data.slice(0, -2);
    }
  }

  toBuffer() {
    return Buffer.concat([
      this.data,
      this.sw,
    ].filter(Boolean));
  }

  noError() {
    return this.sw.equals(this.constructor.noError);
  }
}

module.exports = ResponseApdu;
