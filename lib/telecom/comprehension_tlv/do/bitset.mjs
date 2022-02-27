import log2 from '../../../bigint_log2.mjs';

export default class Bitset {
  static from(data, length) {
    let value = 0n;

    if (Buffer.isBuffer(data)) {
      for (const [n, byte] of data.entries()) {
        value <<= BigInt(8 * n);
        value += BigInt(byte);
      }

      return new Bitset(value);
    }

    length = length ?? log2(data);
    value = BigInt(data) & (2n ** BigInt(length) - 1n);

    return new Bitset(value);
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

  test(pos) {
    return Boolean((this.value >> BigInt(pos)) & 1n);
  }

  set(pos) {
    this.value |= (1n << BigInt(pos));
  }
}
