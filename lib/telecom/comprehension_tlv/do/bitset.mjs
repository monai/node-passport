import { inspect } from 'util';

import log2 from '../../../bigint_log2.mjs';

export default class Bitset {
  static from(data, length) {
    let value = 0n;

    if (Buffer.isBuffer(data)) {
      for (const [n, byte] of data.entries()) {
        if (n > 0) {
          value <<= BigInt(8);
        }
        value += BigInt(byte);
      }

      return new Bitset(value, length ?? data.length * 8);
    }

    length = length ?? log2(data);
    value = BigInt(data) & (2n ** BigInt(length) - 1n);

    return new Bitset(value, length);
  }

  constructor(value, length) {
    this.value = BigInt(value);
    this.length = length;
  }

  valueOf() {
    return this.value;
  }

  toString() {
    return this.value.toString(2).padStart(this.length, '0');
  }

  [inspect.custom](_depth, options) {
    return inspect(this.toString(), options);
  }

  test(pos) {
    return Boolean((this.value >> BigInt(pos)) & 1n);
  }

  set(pos) {
    this.value |= (1n << BigInt(pos));
  }

  * entries() {
    for (let i = 0; i < this.length; i += 1) {
      yield [i, this.test(i)];
    }
  }
}
