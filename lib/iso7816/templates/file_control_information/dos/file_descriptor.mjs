// ISO/IEC 7816-4:2013
// Table 10 — Control parameter data objects
// 7.4.5 File descriptor byte

import { decode as decodeDataCoding } from '../../../dos/software_function/data_coding.mjs';
import { dedicatedFile, elementaryFile } from '../../../data_structure.mjs';

export const fileAccessability = {
  notShareableFile: 'notShareableFile',
  shareableFile: 'shareableFile',
};

const fileAccessabilityCoding = {
  0: fileAccessability.notShareableFile,
  1: fileAccessability.shareableFile,
};

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

const efStructureCoding = {
  0b000: efStructure.noInformationGiven,
  0b001: efStructure.transparentStructure,
  0b010: efStructure.linearStructureFixedSizeNoFurtherInformation,
  0b011: efStructure.linearStructureFixedSizeTlvStructure,
  0b100: efStructure.linearStructureVariableSizeNoFurtherInformation,
  0b101: efStructure.linearStructureVariableSizeTlvStructure,
  0b110: efStructure.cyclicStructureFixedSizeNoFurtherInformation,
  0b111: efStructure.cyclicStructureFixedSizeTlvStructure,
};

export const inspect = decode;

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

// Table 11 — Coding of the file descriptor byte
export function decodeFileDescriptor(byte) {
  const b7 = (byte >> 6) & 1;
  const b6b4 = (byte >> 3) & 7;
  const b3b1 = byte & 7;

  const out = {
    fileAccessability: fileAccessabilityCoding[b7],
  };

  if (b6b4 === 7 && b3b1 === 0) {
    out.dataStructure = dedicatedFile;
  } else {
    out.dataStructure = elementaryFile;

    if (b6b4 === 0) {
      out.efCategory = efCategory.working;
    } else if (b6b4 === 1) {
      out.efCategory = efCategory.internal;
    } else {
      out.efCategory = efCategory.proprietary;
    }
  }

  if (b6b4 < 7) {
    out.efStructure = efStructureCoding[b3b1];
  } else if (b6b4 === 7) {
    if (b3b1 === 1) {
      out.efStructure = efStructure.berTlvStructure;
    } else if (b3b1 === 2) {
      out.efStructure = efStructure.simpleTlvStructure;
    }
  }

  return out;
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
