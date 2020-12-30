const parse = require('../asn1/parse');
const { readUIntBE } = require('../util');

class ControlParameters {
  constructor(data) {
    const tree = parse(data)[0];
    if (tree.tag.identifier !== 0x62) {
      throw new Error('Expected tag 0x62');
    }

    this.data = data;
    this.tree = tree;
    this.dataObjects = {};

    for (const object of tree.children) {
      this.dataObjects[object.tag.identifier] = object;
    }
  }

  get fileLength() {
    const object = this.dataObjects[0x80];
    return object ? readUIntBE(object.contents) : undefined;
  }

  get fileId() {
    return this.dataObjects[0x83]?.contents;
  }

  get shortFileId() {
    return this.dataObjects[0x88]?.contents;
  }

  get lifeCycleStatus() {
    return this.dataObjects[0x8a]?.contents;
  }
}

module.exports = ControlParameters;
