const errors = require('./errors');
const parseSw = require('./sw');

class Iso7816Error extends Error {
  constructor(sw1, sw2) {
    [sw1, sw2] = parseSw(sw1, sw2);

    let message;
    try {
      message = errors[sw1];
      if (typeof message === 'function') {
        message = message(sw1, sw2);
      } else {
        message = message[sw2];
      }
      // eslint-disable-next-line no-empty
    } catch (ex) { }

    message = message ?? 'Unknown error';
    super(message);

    [this.sw1, this.sw2] = [sw1, sw2].map((val) => Buffer.from([val]));
    this.sw = Buffer.concat([this.sw1, this.sw2]);
  }

  get tag() {
    return this.sw.toString('hex');
  }

  get identifier() {
    return this.sw.readUInt16BE();
  }

  get [Symbol.toStringTag]() {
    return this.tag;
  }
}

module.exports = Iso7816Error;
