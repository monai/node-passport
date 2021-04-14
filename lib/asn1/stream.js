/* eslint-disable no-underscore-dangle */
const { Transform } = require('stream');

const { constructed } = require('./encoding');
const { decode: decodeTag } = require('./tag');
const { decode: decodeLength } = require('./length');
const LengthError = require('./LengthError');
const { capitalize } = require('../util');

class Parser extends Transform {
  constructor(options) {
    super({ ...options, readableObjectMode: true });

    this.offset = 0;

    this.chunk = Buffer.alloc(0);
    this.chunkOffset = 0;

    this.stack = [];
    this.i = 1;
  }

  readTag(chunk) {
    const current = this.stack[this.stack.length - 1];

    const [tag, rt] = decodeTag(chunk.slice(this.chunkOffset));

    if (rt > 0) {
      this.incrementOffset(rt);
      current.read += rt;
    }

    current.tag = tag;
    this.push({ offset: this.offset, ...current });

    current.component = 'length';
  }

  readLength(chunk) {
    let current = this.stack[this.stack.length - 1];

    const [length, rl] = decodeLength(chunk.slice(this.chunkOffset));

    if (rl > 0) {
      this.incrementOffset(rl);
      current.read += rl;
    }

    current.length = length;
    this.push({ offset: this.offset, ...current });

    current.component = 'contents';

    if (current.tag.encoding === constructed) {
      this.stack.push(createDataValue());
    }

    if (current.tag.identifier === 0x00 && current.length === 0) {
      const previous = this.stack.pop();
      current = this.stack[this.stack.length - 1];
      if (current && current.length === Infinity) {
        current.read += previous.read;
        current.contentsRead += previous.read;
        this.stack.pop();
      }
    }
  }

  readContents(chunk) {
    let current = this.stack[this.stack.length - 1];

    const length = Math.min(chunk.length, current.length);
    const data = chunk.slice(this.chunkOffset, this.chunkOffset + length);

    this.incrementOffset(length);

    current.read += length;
    current.contentsRead += length;

    this.push({ offset: this.offset, data, ...current });

    while (this.stack.length > 0 && current.contentsRead === current.length) {
      const previous = this.stack.pop();
      if (this.stack.length > 0) {
        current = this.stack[this.stack.length - 1];
        current.read += previous.read;
        current.contentsRead += previous.read;
      }
    }

    if (current.contentsRead < current.length) {
      this.stack.push(createDataValue());
    }
  }

  incrementOffset(length) {
    this.offset += length;
    this.chunkOffset += length;
  }

  _transform(chunk, _encoding, done) {
    this.chunk = Buffer.concat([this.chunk.slice(this.chunkOffset), chunk]);
    this.chunkOffset = 0;

    let isDone = false;
    let readerError;

    do {
      if (isDone) {
        break;
      }

      if (this.chunkOffset < this.chunk.length && this.stack.length === 0) {
        this.stack.push(createDataValue());
      }

      const current = this.stack[this.stack.length - 1];
      const { component } = current;

      try {
        this[`read${capitalize(component)}`](chunk);
      } catch (ex) {
        if (ex instanceof LengthError) {
          isDone = true;
        } else {
          readerError = ex;
        }
      }
    } while (this.chunkOffset < this.chunk.length);

    done(readerError);
  }
}

function createDataValue() {
  return {
    component: 'tag',
    length: undefined,
    read: 0,
    contentsRead: 0,
  };
}

module.exports = Parser;