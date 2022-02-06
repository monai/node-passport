/* eslint-disable no-underscore-dangle */

const { Transform } = require('stream');
const { constructed } = require('../encoding');
const { decode: decodeTag } = require('./tag');
const { decode: decodeLength } = require('./length');
const LengthError = require('../length_error');

class ParserStream extends Transform {
  static dataValueBegin = 'dataValueBegin';
  static dataValueEnd = 'dataValueEnd';
  static tag = 'tag';
  static length = 'length';
  static contents = 'contents';

  constructor(options) {
    super({ ...options, readableObjectMode: true });

    this.readers = {
      tag: this.readTag.bind(this),
      length: this.readLength.bind(this),
      contents: this.readContents.bind(this),
    };

    this.offset = 0;

    this.chunk = Buffer.alloc(0);
    this.chunkOffset = 0;

    this.stack = [];
  }

  _transform(chunk, _encoding, done) {
    this.chunk = Buffer.concat([this.chunk.slice(this.chunkOffset), chunk]);
    this.chunkOffset = 0;

    while (this.isUnreadData()) {
      if (this.stack.length === 0) {
        this.dataValueBegin();
      }

      const current = this.stack[this.stack.length - 1];
      const { component } = current;

      try {
        this.readers[component](chunk);
      } catch (ex) {
        if (ex instanceof LengthError) {
          break;
        } else {
          this.destroy(ex);
          return;
        }
      }
    }

    done();
  }

  readTag(chunk) {
    const current = this.stack[this.stack.length - 1];

    const [tag, rt] = decodeTag(chunk.slice(this.chunkOffset));

    if (rt > 0) {
      current.read += rt;
    }

    current.tag = tag;
    this.push({
      component: current.component,
      offset: this.offset,
      read: rt,
      tag: current.tag,
      data: chunk.slice(this.chunkOffset, this.chunkOffset + rt),
    });

    if (rt > 0) {
      this.incrementOffset(rt);
    }

    current.component = this.constructor.length;
  }

  readLength(chunk) {
    const current = this.stack[this.stack.length - 1];

    const [length, rl] = decodeLength(chunk.slice(this.chunkOffset));

    if (rl > 0) {
      current.read += rl;
    }

    current.length = length;
    this.push({
      component: current.component,
      offset: this.offset,
      read: rl,
      length,
      data: chunk.slice(this.chunkOffset, this.chunkOffset + rl),
    });

    if (rl > 0) {
      this.incrementOffset(rl);
    }

    current.component = this.constructor.contents;

    if (current.length === 0) {
      this.collapse();

      if (this.isUnreadData()) {
        this.dataValueBegin();
      }
    } else if (current.tag.encoding === constructed) {
      this.dataValueBegin();
    }
  }

  readContents(chunk) {
    const current = this.stack[this.stack.length - 1];

    const length = Math.min(chunk.length, current.length);
    const contents = chunk.slice(this.chunkOffset, this.chunkOffset + length);

    current.read += length;
    current.contentsRead += length;

    this.push({
      component: current.component,
      offset: this.offset,
      read: length,
      contents,
    });

    this.incrementOffset(length);

    if (current.contentsRead === current.length) {
      this.collapse();
    }

    if (current.contentsRead <= current.length && this.isUnreadData()) {
      this.dataValueBegin();
    }
  }

  dataValueBegin() {
    this.stack.push(createDataValue());
    this.push({ component: this.constructor.dataValueBegin, depth: this.stack.length });
  }

  dataValueEnd() {
    this.stack.pop();
    this.push({ component: this.constructor.dataValueEnd, depth: this.stack.length });
  }

  collapse() {
    let current = this.stack[this.stack.length - 1];
    let previous = this.stack[this.stack.length - 2];

    if (current.tag.identifier === 0x00 && previous?.length === Infinity) {
      this.dataValueEnd();
      this.dataValueEnd();

      current = this.stack[this.stack.length - 1];
      previous = this.stack[this.stack.length - 2];
    }

    // NOTE: current.contentsRead >= current.length
    // Collapse malformed Constructed encodings
    while (current && current.contentsRead >= current.length) {
      this.dataValueEnd();

      if (previous) {
        previous.read += current.read;
        previous.contentsRead += current.read;
      }

      current = this.stack[this.stack.length - 1];
      previous = this.stack[this.stack.length - 2];
    }
  }

  isUnreadData() {
    return this.chunkOffset < this.chunk.length;
  }

  incrementOffset(length) {
    this.offset += length;
    this.chunkOffset += length;
  }
}

function createDataValue() {
  return {
    component: ParserStream.tag,
    length: undefined,
    read: 0,
    contentsRead: 0,
  };
}

module.exports = ParserStream;
