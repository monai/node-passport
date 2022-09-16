import { inspect } from 'util';

export default class Bitset {
  static from(data, length) {
    if (Buffer.isBuffer(data)) {
      const bitLength = length ?? data.length * 8;
      const bytes = data.subarray(0, Math.ceil(bitLength / 8));

      const hiBits = bitLength % 8;
      if (hiBits) {
        const mask = 2 ** hiBits - 1;
        bytes[0] &= mask;
      }

      return new Bitset(bytes, bitLength);
    }

    data = BigInt(data);
    const byteLength = Math.ceil(length / 8);

    const bytes = Buffer.alloc(byteLength);
    for (let i = 0; i < byteLength; i += 1) {
      const maxLength = Math.min(length - i * 8, 8);
      const mask = 2 ** maxLength - 1;

      bytes[bytes.length - 1 - i] = Number(data & BigInt(mask));
      data >>= 8n;
    }

    return new Bitset(bytes, length);
  }

  static posInByte(length, pos) {
    return [length - 1 - Math.floor(pos / 8), pos % 8];
  }

  constructor(value, length) {
    this.value = value;
    this.length = length;
  }

  valueOf() {
    return this.value;
  }

  toString() {
    const bytes = new Array(this.value.length);
    for (const [n, byte] of this.value.entries()) {
      const maxLength = n === 0 ? this.length % 8 || 8 : 8;

      bytes[n] = byte.toString(2).padStart(maxLength, '0');
    }

    return bytes.join('');
  }

  [inspect.custom]() {
    return `<${this.constructor.name} ${this.toString()}>`;
  }

  test(pos) {
    if (pos < 0 || pos >= this.length) {
      throw new Error('pos is out of range');
    }

    const [byte, bit] = this.constructor.posInByte(this.value.length, pos);
    return Boolean((this.value[byte] >> bit) & 1);
  }

  set(pos) {
    if (pos < 0 || pos >= this.length) {
      throw new Error('pos is out of range');
    }

    const [byte, bit] = this.constructor.posInByte(this.value.length, pos);
    this.value[byte] |= (1 << bit);
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
