import { inspect } from 'util';

import log2 from './bigint_log2.mjs';

export default class Bitset {
  static from(data, length) {
    if (Buffer.isBuffer(data)) {
      let value = 0n;

      for (const [n, byte] of data.entries()) {
        if (length !== undefined && length !== null && (n + 1) * 8 > length) {
          break;
        }

        if (n > 0) {
          value <<= 8n;
        }
        value += BigInt(byte);
      }

      return new Bitset(value, length ?? data.length * 8);
    }

    length = length ?? Number(log2(data));
    return new Bitset(data, length);
  }

  constructor(value, length) {
    this.value = trim(BigInt(value), length);
    this.length = length;
  }

  valueOf() {
    return trim(this.value, this.length);
  }

  toString() {
    return this.value.toString(2).padStart(this.length, '0');
  }

  [inspect.custom]() {
    return `<${this.constructor.name} ${this.toString()}>`;
  }

  test(pos) {
    return Boolean((this.value >> BigInt(pos)) & 1n);
  }

  set(pos) {
    if (pos < 0 || pos > this.length) {
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

function trim(number, length) {
  return number & (2n ** BigInt(length) - 1n);
}
