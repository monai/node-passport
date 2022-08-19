import { inspect } from 'util';
import parseSw from './sw.mjs';
import Iso7816Error from './iso7816_error.mjs';

class ResponseApdu {
  static noError = 0x9000;
  static status6282 = 0x6282;

  constructor(data, sw1, sw2) {
    this.data = data;

    [sw1, sw2] = parseSw(sw1, sw2);

    if (typeof sw1 === 'number' && typeof sw2 === 'number') {
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

    if (!Buffer.isBuffer(data) || this.data.length === 0) {
      delete this.data;
    }
  }

  toBuffer() {
    return Buffer.concat([
      this.data,
      this.sw,
    ].filter(Boolean));
  }

  noError() {
    const sw = this.sw.readUInt16BE();

    return sw >= this.constructor.noError
      || (this?.data?.length > 0 && sw === this.constructor.status6282);
  }

  toError() {
    if (!this.noError()) {
      return new Iso7816Error(this.sw);
    }

    return null;
  }

  toString() {
    return this.toBuffer().toString('hex');
  }

  toDebugString() {
    return [
      this?.data?.toString('hex'),
      this[Symbol.toStringTag],
    ].filter(Boolean).join(' ');
  }

  get [Symbol.toStringTag]() {
    return this.sw.toString('hex');
  }

  [inspect.custom]() {
    return `<${this.constructor.name} ${this.toDebugString()}>`;
  }
}

export default ResponseApdu;
