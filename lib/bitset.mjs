import { inspect } from 'util';

export default class Bitset {
  static from(data, length) {
    if (Buffer.isBuffer(data)) {
      let value = 0n;

      const bitLength = length ?? data.length * 8;
      const byteLength = Math.ceil(bitLength / 8);
      data = data.subarray(data.length - byteLength, data.length);

      const hiRemainder = bitLength % 8;
      const hiMask = 2 ** (hiRemainder || 8) - 1;

      for (const [n, byte] of data.entries()) {
        if (n > 0) {
          value <<= 8n;
        }

        value |= BigInt(byte & (n === 0 ? hiMask : 0xff));
      }

      return new Bitset(value, bitLength);
    }

    const value = BigInt(data) & 2n ** BigInt(length) - 1n;
    return new Bitset(value, length);
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

  [inspect.custom]() {
    let str = this.toString();
    const more = str.length - 100;

    if (more > 0) {
      str = `${str.slice(0, 100)} ... ${more} bits`;
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
}
