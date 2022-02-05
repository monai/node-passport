/* eslint-disable no-plusplus */

function log2(x) {
  let res = 0;
  x = BigInt(x);
  while (x) {
    x /= 2n;
    res++;
  }
  return res;
}

class Bitset {
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

  constructor(value) {
    this.value = BigInt(value);
  }

  valueOf() {
    return this.value;
  }

  toString(...args) {
    return this.value.toString(...args);
  }

  test(pos) {
    return Boolean((this.value >> BigInt(pos)) & 1n);
  }
}

module.exports = Bitset;
