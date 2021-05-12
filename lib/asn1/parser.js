const { EventEmitter } = require('events');

const { constructed } = require('./encoding');
const { decode: decodeTag } = require('./tag');
const { decode: decodeLength } = require('./length');
const LengthError = require('./length_error');

class Parser extends EventEmitter {
  static push = 'push';
  static pop = 'pop';
  static tag = 'tag';
  static length = 'length';
  static contents = 'contents';

  static createDataValue() {
    return {
      component: this.tag,
      length: undefined,
      read: 0,
      contentsRead: 0,
    };
  }

  constructor() {
    super();

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

  read(chunk) {
    this.chunk = Buffer.concat([this.chunk.slice(this.chunkOffset), chunk]);
    this.chunkOffset = 0;

    do {
      if (this.isUnreadData() && this.stack.length === 0) {
        this.push();
      }

      const current = this.stack[this.stack.length - 1];
      const { component } = current;

      try {
        this.readers[component](chunk);
      } catch (ex) {
        if (ex instanceof LengthError) {
          break;
        } else {
          this.emit('error', ex);
          return;
        }
      }
    } while (this.isUnreadData());

    this.emit('finish', this.chunk.length - this.chunkOffset);
  }

  readTag(chunk) {
    const current = this.stack[this.stack.length - 1];

    const [tag, rt] = decodeTag(chunk.slice(this.chunkOffset));

    if (rt > 0) {
      current.read += rt;
    }

    current.tag = tag;
    this.emit('data', {
      component: current.component,
      offset: this.offset,
      read: rt,
      tag: current.tag,
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
    this.emit('data', {
      component: current.component,
      offset: this.offset,
      read: rl,
      length,
    });

    if (rl > 0) {
      this.incrementOffset(rl);
    }

    current.component = this.constructor.contents;

    if (current.length === 0) {
      this.collapse();
      this.push();
    } else if (current.tag.encoding === constructed) {
      this.push();
    }
  }

  readContents(chunk) {
    const current = this.stack[this.stack.length - 1];

    const length = Math.min(chunk.length, current.length);
    const contents = chunk.slice(this.chunkOffset, this.chunkOffset + length);

    current.read += length;
    current.contentsRead += length;

    this.emit('data', {
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
      this.push();
    }
  }

  push() {
    this.stack.push(this.constructor.createDataValue());
    this.emit('data', { stack: this.constructor.push, length: this.stack.length });
  }

  pop() {
    this.stack.pop();
    this.emit('data', { stack: this.constructor.pop, length: this.stack.length });
  }

  collapse() {
    let current = this.stack[this.stack.length - 1];
    let previous = this.stack[this.stack.length - 2];

    if (current.tag.identifier === 0x00 && previous?.length === Infinity) {
      this.pop();
      this.pop();

      current = this.stack[this.stack.length - 1];
      previous = this.stack[this.stack.length - 2];
    }

    while (current && current.length === current.contentsRead) {
      this.pop();

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

module.exports = Parser;
