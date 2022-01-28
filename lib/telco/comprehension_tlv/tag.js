// ETSI TS 101 220 V16.0.0 (2021-04)

const util = require('util');

const invalidFbv = [0x00, 0xff];
const rfuFbv = [0x80];
const threeByteIdentifier = 0x7f;

class Tag {
  constructor(cr, value, data) {
    if (data.length !== 1 && data.length !== 3) {
      throw new RangeError(`The length of data is out of range. It must be == 1 or == 3. Received ${data.length}`);
    }

    this.cr = cr;
    this.value = value;
    this.data = data;
  }

  valueOf() {
    return this.data;
  }

  toString() {
    return this.data.toString('hex');
  }

  toValueString() {
    const { length } = this.data;

    let buffer;
    if (length === 1) {
      buffer = Buffer.alloc(1);
      buffer.writeUInt8(this.value);
    } else if (length === 3) {
      buffer = Buffer.alloc(2);
      buffer.writeUInt16BE(this.value);
    }

    return buffer.toString('hex');
  }

  toDebugString() {
    return `${this.toString()} ${this.cr}:${this.toValueString()}`;
  }

  get [Symbol.toStringTag]() {
    return this.toString();
  }

  [util.inspect.custom]() {
    const { name } = this.constructor;

    return `<${name} ${this.toDebugString()}>`;
  }
}

module.exports = {
  encode,
  decode,
  Tag,
};

function encode() {
  throw new Error('Not implemented');
}

// 7.1.1 COMPREHENSION-TLV tag coding
function decode(data) {
  const firstByte = data[0];

  if (invalidFbv.includes(firstByte)) {
    throw new RangeError(`The value of the first byte '${firstByte}' is not used`);
  } else if (rfuFbv.includes(firstByte)) {
    throw new RangeError(`The value of the first byte '${firstByte}' is reserved for future use`);
  }

  let cr;
  let value;
  let length;
  if (firstByte === threeByteIdentifier) {
    const word = data.slice(1).readUInt32BE();
    cr = (word >> 15) & 0x01;
    value = word & 0x7fff;
    length = 3;
  } else {
    cr = (firstByte >> 7) & 0x01;
    value = firstByte & 0x7f;
    length = 1;
  }

  return [new Tag(cr, value, data.slice(0, length)), length];
}
