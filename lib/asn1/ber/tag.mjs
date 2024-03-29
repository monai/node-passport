import { inspect } from 'util';
import klassNames from '../klass.mjs';
import encodingNames from '../encoding.mjs';
import LengthError from '../length_error.mjs';

export class Tag {
  constructor(klass, encoding, number, data) {
    this.klass = klass;
    this.encoding = encoding;
    this.number = number;
    this.data = data;
    this.dataAligned = undefined;

    if (this.data.length <= 4) {
      this.dataAligned = Buffer.alloc(4);
      this.data.copy(this.dataAligned, 4 - this.data.length);
    }
  }

  get identifier() {
    if (this.dataAligned) {
      return this.dataAligned.readInt32BE();
    }

    return undefined;
  }

  get klassName() {
    return klassNames[this.klass];
  }

  get klassTag() {
    return this.klassName[0];
  }

  get encodingName() {
    return encodingNames[this.encoding];
  }

  get encodingTag() {
    return this.encodingName[0];
  }

  valueOf() {
    return this.data;
  }

  toString() {
    return this.valueOf().toString('hex');
  }

  toDebugString() {
    return `${this.toString()} ${this.klassTag}${this.encodingTag}`;
  }

  get [Symbol.toStringTag]() {
    return this.toString();
  }

  [inspect.custom]() {
    const { name } = this.constructor;

    return `<${name} ${this.toDebugString()}>`;
  }
}

export function encode(klass, encoding, number, options = {}) {
  if (number > Number.MAX_SAFE_INTEGER) {
    throw new RangeError('Number is greater than max safe integer');
  }

  const firstByte = (klass << 6) | (encoding << 5);

  if (number < 31 && !options.multibyte) {
    return Buffer.from([firstByte | number]);
  }

  const n = Math.ceil(Math.log2(number) / 7);

  const buffer = Buffer.alloc(n + 1);
  buffer[0] = firstByte | 0x1f;

  for (let i = 0; i < n; i += 1) {
    buffer[n - i] = ((i === 0) ? 0 : 0x80) | (Math.trunc(number / 0x80 ** i) & 0x7f);
  }

  return buffer;
}

export function decode(data) {
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
      number += byte & 0x7f;
      if (byte & 0x80) {
        number *= 0x80;
      }
    } while (byte & 0x80);
  }

  return [
    new Tag(klass, encoding, number, data.slice(0, read)),
    read,
  ];
}
