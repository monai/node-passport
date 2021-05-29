const { decode } = require('../tag');

class Type {
  constructor(identifier, options, cb) {
    if (typeof options === 'function') {
      cb = options;
      options = undefined;
    }

    // TODO: Refactor decode
    [this.tag] = decode(Buffer.from(identifier.toString(16), 'hex'));
    this.options = options || {};

    if (this.tag.identifier === 0x30) {
      this.options.ordered = true;
    } else if (this.tag.identifier === 0x31) {
      this.options.ordered = false;
    }

    this.offset = 0;
    this.children = [];

    if (cb) {
      cb(this);
    }
  }

  addType(type) {
    this.children.push(type);

    return this;
  }

  createType(identifier, options, cb) {
    const type = new this.constructor(identifier, options, cb);
    this.children.push(type);

    return this;
  }

  toObject() {
    if (this.tag.encoding === 1) {
      const entries = this.children.reduce((acc, type) => {
        const obj = type.toObject();
        acc.push([type.options?.identifier || type.tag.number, obj]);
        acc.push([type.tag.identifier, obj]);
        return acc;
      }, []);
      return Object.fromEntries(entries);
    }

    return this.contents;
  }
}

module.exports = Type;
