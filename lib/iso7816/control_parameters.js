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
    this.dataObjects = tree.children.reduce((acc, n) => {
      acc[n.tag.identifier] = n;
      return acc;
    }, {});
  }

  get fileLength() {
    const obj = this.dataObjects[0x80];
    return obj ? readUIntBE(obj.contents) : null;
  }

  get fileId() {
    return nullableObject(this.dataObjects[0x83]);
  }

  get shortFileId() {
    return nullableObject(this.dataObjects[0x88]);
  }

  get lifeCycleStatus() {
    return nullableObject(this.dataObjects[0x8a]);
  }
}

function nullableObject(obj) {
  return obj ? obj.contents : null;
}

module.exports = ControlParameters;
