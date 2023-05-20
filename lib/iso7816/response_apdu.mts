import { inspect } from 'util';
import Iso7816Error from './iso7816_error.mjs';

class ResponseApdu {
  static noError = 0x9000;
  static status6282 = 0x6282;

  data?: Buffer;
  sw1: number;
  sw2: number;

  constructor(sw1: number, sw2: number, data?: Buffer) {
    this.data = data;

    this.sw1 = sw1 & 0xff;
    this.sw2 = sw2 & 0xff;
  }

  static fromBuffer(data: Buffer) {
    if (data.length < 2) {
      throw new RangeError(`The length of value "data" is out of range. It must be >= 2. Received ${data.length}`);
    }

    const sw1 = data.readUInt8(data.length - 2);
    const sw2 = data.readUInt8(data.length - 1);

    return new this(sw1, sw2, data.subarray(0, -2));
  }

  get sw() {
    return (this.sw1 << 8) | this.sw2;
  }

  toBuffer(includeData = true) {
    const out = [];

    if (includeData && this.data) {
      out.push(this.data);
    }

    out.push(Buffer.from([this.sw1, this.sw2]));

    return Buffer.concat(out);
  }

  noError() {
    if (this.sw >= ResponseApdu.noError) {
      return true;
    }

    if (this.sw === ResponseApdu.status6282 && (this.data?.length ?? -1 > 0)) {
      return true;
    }

    return false;
  }

  toError() {
    if (!this.noError()) {
      return new Iso7816Error(this.sw);
    }

    return undefined;
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
    return this.toBuffer(false).toString('hex');
  }

  [inspect.custom]() {
    return `<${this.constructor.name} ${this.toDebugString()}>`;
  }
}

export default ResponseApdu;
