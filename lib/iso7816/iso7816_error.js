import errors from './errors.js';
import parseSw from './sw.js';

class Iso7816Error extends Error {
  constructor(sw1, sw2) {
    [sw1, sw2] = parseSw(sw1, sw2);

    let message = errors[sw1];
    if (message) {
      if (sw2 in message) {
        message = message[sw2];
      } else if (typeof message.other === 'function') {
        message = message.other(sw2);
      }
    }
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

export default Iso7816Error;
