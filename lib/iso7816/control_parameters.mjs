import parse from '../asn1/util/parse.mjs';
import { readUIntBE } from '../util.mjs';

const lifeCycleStatus = {
  noInformationGiven: 'noInformationGiven',
  creationState: 'creationState',
  initialisationState: 'initialisationState',
  operationalStateActivated: 'operationalStateActivated',
  operationalStateDeactivated: 'operationalStateDeactivated',
  terminationState: 'terminationState',
  proprietary: 'proprietary',
};

const efCategory = {
  working: 'working',
  internal: 'internal',
  proprietary: 'proprietary',
};

const efStructure = {
  noInformationGiven: 'noInformationGiven',
  transparentStructure: 'transparentStructure',
  linearStructureFixedSizeNoFurtherInformation: 'linearStructureFixedSizeNoFurtherInformation',
  linearStructureFixedSizeTlvStructure: 'linearStructureFixedSizeTlvStructure',
  linearStructureVariableSizeNoFurtherInformation: 'linearStructureVariableSizeNoFurtherInformation',
  linearStructureVariableSizeTlvStructure: 'linearStructureVariableSizeTlvStructure',
  cyclicStructureFixedSizeNoFurtherInformation: 'cyclicStructureFixedSizeNoFurtherInformation',
  cyclicStructureFixedSizeTlvStructure: 'cyclicStructureFixedSizeTlvStructure',
  berTlvStructure: 'berTlvStructure',
  simpleTlvStructure: 'simpleTlvStructure',
};

const efStructureMap = {
  0b000: efStructure.noInformationGiven,
  0b001: efStructure.transparentStructure,
  0b010: efStructure.linearStructureFixedSizeNoFurtherInformation,
  0b011: efStructure.linearStructureFixedSizeTlvStructure,
  0b100: efStructure.linearStructureVariableSizeNoFurtherInformation,
  0b101: efStructure.linearStructureVariableSizeTlvStructure,
  0b110: efStructure.cyclicStructureFixedSizeNoFurtherInformation,
  0b111: efStructure.cyclicStructureFixedSizeTlvStructure,
};

const writeBehavior = {
  0b00: 'oneTimeWrite',
  0b01: 'proprietary',
  0b10: 'writeOr',
  0b11: 'writeAnd',
};

const betTlvTagFirstByteFf = {
  0: 'invalid',
  1: 'valid',
};

export default class ControlParameters {
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

  get fileDescriptor() {
    let data = this.dataObjects[0x82]?.contents;

    if (!data) {
      return undefined;
    }

    const out = {
      fileDescriptor: decodeFileDescriptor(data[0]),
    };
    data = data.slice(1);

    if (data.length >= 1) {
      out.dataCoding = decodeDataCoding(data[0]);
    }
    data = data.slice(1);

    if (data.length >= 1) {
      const [number, read] = readNumber(data);
      out.maximumRecordSize = number;
      data = data.slice(read);
    }

    if (data.length >= 1) {
      const [number, read] = readNumber(data);
      out.numberOfRecords = number;
      data = data.slice(read);
    }

    return out;
  }

  get fileId() {
    return this.dataObjects[0x83]?.contents;
  }

  get shortFileId() {
    return this.dataObjects[0x88]?.contents;
  }

  get lifeCycleStatus() {
    const data = this.dataObjects[0x8a]?.contents;

    if (!data?.length) {
      return undefined;
    }

    const byte = data[0];

    if (byte === 0) {
      return lifeCycleStatus.noInformationGiven;
    }

    if (byte === 1) {
      return lifeCycleStatus.creationState;
    }

    if (byte === 3) {
      return lifeCycleStatus.initialisationState;
    }

    if (byte & 4) {
      if (byte & 1) {
        return lifeCycleStatus.operationalStateActivated;
      }

      return lifeCycleStatus.operationalStateDeactivated;
    }

    if (byte & 4 && byte & 8) {
      return lifeCycleStatus.terminationState;
    }

    if (byte >= 16) {
      return lifeCycleStatus.proprietary;
    }

    return undefined;
  }
}

function decodeFileDescriptor(byte) {
  const out = {
    shareable: !!(byte & 0x40),
  };

  const b6b4 = (byte >> 3) & 7;
  const b3b1 = out & 7;

  if (b6b4 === 7 && b3b1 === 0) {
    out.df = true;
  } else if (b6b4 === 0) {
    out.efCategory = efCategory.working;
  } else if (b6b4 === 1) {
    out.efCategory = efCategory.internal;
  } else {
    out.efCategory = efCategory.proprietary;
  }

  if (b6b4 < 7) {
    out.efStructure = efStructureMap[b3b1];
  } else if (b6b4 === 7) {
    if (b3b1 === 1) {
      out.efStructure = efStructure.berTlvStructure;
    } else if (b3b1 === 2) {
      out.efStructure = efStructure.simpleTlvStructure;
    }
  }

  return out;
}

function decodeDataCoding(byte) {
  const b7b6 = (byte >> 5) & 3;
  const b5 = (byte >> 4) & 1;
  const b4b1 = byte & 15;

  return {
    efsOfBerTlv: !!(byte & 0x80),
    writeBehavior: writeBehavior[b7b6],
    betTlvTagFirstByteFf: betTlvTagFirstByteFf[b5],
    dataUnitSizeInQuartets: 2 ** b4b1,
  };
}

function readNumber(data) {
  if (data.length >= 1) {
    if (data.length >= 2) {
      return [data.readUInt16BE(), 2];
    }
    return [data.readUInt8(), 1];
  }

  return undefined;
}
