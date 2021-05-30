class Type {
  constructor(options, cb) {
    this.options = options;

    if ('tagIdentifier' in options) {
      const { tag } = options;
      this.tagIdentifier = (typeof tag !== 'string') ? tag.toString(16) : tag;
    } else if ('tagNumber' in options) {
      this.tagNumber = options.tagNumber;
    }

    this.ordered = options.ordered;
    if (this.tagIdentifier === 0x30) {
      this.ordered = true;
    } else if (this.tagIdentifier === 0x31) {
      this.ordered = false;
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
