import { inspect } from 'util';

export default class Bitset {
  static from(data, length) {
    if (Buffer.isBuffer(data)) {
      let value = 0n;

      const bitLength = length ?? data.length * 8;
      const byteLength = Math.ceil(bitLength / 8);
      data = data.subarray(data.length - byteLength, data.length);

      for (const [n, byte] of data.entries()) {
        if (n > 0) {
          value <<= 8n;
        }

        value |= BigInt(byte & (n === 0 ? this.hiMask(bitLength) : 0xff));
      }

      return new Bitset(value, bitLength);
    }

    const value = BigInt(data) & 2n ** BigInt(length) - 1n;
    return new Bitset(value, length);
  }

  static hiMask(length) {
    return 2 ** ((length % 8) || 8) - 1;
  }

  constructor(value, length) {
    this.value = value;
    this.length = length;
  }

  valueOf() {
    return this.value;
  }

  toString() {
    if (this.length === 0) {
      return '';
    }

    return this.value.toString(2).padStart(this.length, '0');
  }

  toBuffer() {
    return Buffer.from(Array.from(this.bytes()).reverse());
  }

  [inspect.custom]() {
    let length = Math.ceil(this.length / 8);
    const remainder = this.length % 8;

    const ary = new Array(length);
    for (const byte of this.bytes()) {
      length -= 1;
      const pad = length === 0 && remainder > 0 ? remainder : 8;
      ary[length] = byte.toString(2).padStart(pad, '0').replace(/([01]{4})$/, ' $1');
    }

    const more = this.length - 100;
    let str;
    if (more > 0) {
      str = `${more} bits more ... ${ary.slice(-25).join(' ')}`;
    } else {
      str = ary.join(' ');
    }

    return `<${this.constructor.name} ${str}>`;
  }

  test(pos) {
    if (pos < 0 || pos >= this.length) {
      throw new Error('pos is out of range');
    }

    return Boolean((this.value >> BigInt(pos)) & 1n);
  }

  set(pos) {
    if (pos < 0 || pos >= this.length) {
      throw new Error('pos is out of range');
    }

    this.value |= (1n << BigInt(pos));
  }

  * [Symbol.iterator]() {
    for (let i = 0; i < this.length; i += 1) {
      yield this.test(i);
    }
  }

  * entries() {
    for (let i = 0; i < this.length; i += 1) {
      yield [i, this.test(i)];
    }
  }

  * bytes() {
    const byteLength = Math.ceil(this.length / 8);
    const hiMask = BigInt(this.constructor.hiMask(this.length));

    let { value } = this;
    for (let i = 0; i < byteLength; i += 1) {
      yield Number(value & (i === byteLength - 1 ? hiMask : 0xffn));
      value >>= 8n;
    }
  }
}
