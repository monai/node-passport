import { inspect } from 'util';

import log2 from './bigint_log2.mjs';
import bitReverse from './bit_reverse.mjs';

export default class Bitset {
  static from(data, length) {
    if (Buffer.isBuffer(data)) {
      const bitLength = length ?? data.length * 8;
      const bytes = data.subarray(0, Math.ceil(bitLength / 8));

      return new Bitset(bytes, bitLength);
    }

    const bitLength = length ?? Number(log2(data));
    const byteLength = Math.ceil(bitLength / 8);

    const bytes = Buffer.alloc(byteLength);
    for (let i = 0; i < byteLength; i += 1) {
      bytes[i] = bitReverse(Number(data & 0xffn));
      data >>= 8n;
    }

    return new Bitset(bytes, bitLength);
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
      const maxLength = Math.min(this.length - n * 8, 8);
      bytes[n] = byte.toString(2).padStart(8, '0').slice(0, maxLength);
    }

    return bytes.join('');
  }

  [inspect.custom]() {
    return `<${this.constructor.name} ${this.toString()}>`;
  }

  test(pos) {
    const byte = Math.floor(pos / 8);
    const bit = pos % 8;

    return Boolean((this.value[byte] >> (7 - bit)) & 1);
  }

  set(pos) {
    if (pos < 0 || pos > this.length) {
      throw new Error('pos is out of range');
    }

    const byte = Math.floor(pos / 8);
    const bit = pos % 8;

    this.value[byte] |= (1 << (7 - bit));
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
