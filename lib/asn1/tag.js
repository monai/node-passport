const util = require('util');
const klassValues = require('./klass');
const encodingValues = require('./encoding');

module.exports = {
  encode,
  decode,
};

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

  get tagNumber() {
    if (this.dataAligned) {
      return this.dataAligned.readInt32BE();
    }

    return null;
  }

  valueOf() {
    return this.data;
  }

  toString() {
    return this.data.toString('hex');
  }

  get [Symbol.toStringTag]() {
    return `0x${this.toString()}`;
  }

  [util.inspect.custom]() {
    const { name } = this.constructor;
    const toStringTag = this[Symbol.toStringTag];
    const klassValue = klassValues[this.klass][0];
    const encodingValue = encodingValues[this.encoding][0];

    return `<${name} ${toStringTag} ${klassValue}${encodingValue}>`;
  }
}

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
      byte = data[read += 1];
      number = number << 8 ^ byte & 0x7f;
    } while (byte & 0x80);
  }

  return [
    new Tag(klass, encoding, number, data.slice(0, read)),
    read,
  ];
}
