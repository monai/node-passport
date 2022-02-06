const parse = require('../asn1/util/parse');
const { readUIntBE } = require('../util');

const lifeCycleStatus = {
  noInformationGiven: 'noInformationGiven',
  creationState: 'creationState',
  initialisationState: 'initialisationState',
  operationalStateActivated: 'operationalStateActivated',
  operationalStateDeactivated: 'operationalStateDeactivated',
  terminationState: 'terminationState',
  proprietary: 'proprietary',
};

class ControlParameters {
  constructor(data) {
    const tree = parse(data);
    const template = tree.node.children[0];

    if (template.tag.identifier !== 0x62) {
      throw new Error('Expected tag 0x62');
    }

    this.dataObjects = template.children.reduce((acc, n) => {
      acc[n.tag.identifier] = n;
      return acc;
    }, {});
  }

  get fileLength() {
    const obj = this.dataObjects[0x80];
    return obj ? readUIntBE(obj.contents) : undefined;
  }

  get fileId() {
    return this.dataObjects[0x83]?.contents;
  }

  get shortFileId() {
    return this.dataObjects[0x88]?.contents;
  }

  get lifeCycleStatus() {
    const lcs = this.dataObjects[0x8a]?.contents?.[0];
    if (lcs) {
      if (lcs === 0) {
        return lifeCycleStatus.noInformationGiven;
      }

      if (lcs === 1) {
        return lifeCycleStatus.creationState;
      }

      if (lcs === 3) {
        return lifeCycleStatus.initialisationState;
      }

      if (lcs & 4) {
        if (lcs & 1) {
          return lifeCycleStatus.operationalStateActivated;
        }

        return lifeCycleStatus.operationalStateDeactivated;
      }

      if (lcs & 4 && lcs & 8) {
        return lifeCycleStatus.terminationState;
      }

      if (lcs >= 16) {
        return lifeCycleStatus.proprietary;
      }
    }

    return undefined;
  }
}

module.exports = {
  lifeCycleStatus,
  ControlParameters,
};
