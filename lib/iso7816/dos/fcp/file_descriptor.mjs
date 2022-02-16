export const efCategory = {
  working: 'working',
  internal: 'internal',
  proprietary: 'proprietary',
};

export const efStructure = {
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

export const writeBehavior = {
  oneTimeWrite: 'oneTimeWrite',
  proprietary: 'proprietary',
  writeOr: 'writeOr',
  writeAnd: 'writeAnd',
};

const writeBehaviorMap = {
  0b00: writeBehavior.oneTimeWrite,
  0b01: writeBehavior.proprietary,
  0b10: writeBehavior.writeOr,
  0b11: writeBehavior.writeAnd,
};

export const berTlvTagFirstByteFf = {
  invalid: 'invalid',
  valid: 'valid',
};

const berTlvTagFirstByteFfMap = {
  0: berTlvTagFirstByteFf.invalid,
  1: berTlvTagFirstByteFf.valid,
};

export function encode() {
  throw new Error('Not implemented');
}

export function decode(data) {
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

export function decodeFileDescriptor(byte) {
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

export function decodeDataCoding(byte) {
  const b7b6 = (byte >> 5) & 3;
  const b5 = (byte >> 4) & 1;
  const b4b1 = byte & 15;

  return {
    efsOfBerTlv: !!(byte & 0x80),
    writeBehavior: writeBehaviorMap[b7b6],
    berTlvTagFirstByteFf: berTlvTagFirstByteFfMap[b5],
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
