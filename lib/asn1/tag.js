/* eslint-disable max-classes-per-file */

const util = require('util');
const klassNames = require('./klass');
const encodingNames = require('./encoding');
const LengthError = require('./LengthError');

class Tag {
  constructor(klass, encoding, number, data) {
    this.klass = klass;
    this.encoding = encoding;
    this.number = number;
    this.data = data;

    if (this.data.length <= 4) {
      this.dataAligned = Buffer.alloc(4);
      this.data.copy(this.dataAligned, 4 - this.data.length);
    } else {
      this.dataAligned = null;
    }
  }

  get identifier() {
    if (this.dataAligned) {
      return this.dataAligned.readInt32BE();
    }

    return null;
  }

  get klassName() {
    return klassNames[this.klass];
  }

  get encodingName() {
    return encodingNames[this.encoding];
  }

  valueOf() {
    return this.data;
  }

  toString() {
    return this.data.toString('hex');
  }

  toDebugString() {
    const klassName = this.klassName[0];
    const encodingName = this.encodingName[0];

    return `${this.toString()} ${klassName}${encodingName}`;
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

}

function decode(data) {
  const identifier = data[0];
  const klass = identifier >>> 6;
  const encoding = (identifier >>> 5) & 0x01;
  let number = identifier & 0x1f;
  let read = 1;

  if (number === 0x1f) {
    number = 0;
    let byte;
    do {
      if (read === data.length) {
        throw new LengthError(data.length + 1, data.length);
      }

      byte = data[read];
      read += 1;
      number = number << 8 ^ byte & 0x7f;
    } while (byte & 0x80);
  }

  return [
    new Tag(klass, encoding, number, data.slice(0, read)),
    read,
  ];
}
