// ISO/IEC 7816-4:2013(E)
// Table 118 — Coding of the second software function table (data coding byte)

export const writeBehavior = {
  oneTimeWrite: 'oneTimeWrite',
  proprietary: 'proprietary',
  writeOr: 'writeOr',
  writeAnd: 'writeAnd',
};

export const berTlvTagFirstByteFf = {
  invalid: 'invalid',
  valid: 'valid',
};

const berTlvTagFirstByteFfCoding = {
  0: berTlvTagFirstByteFf.invalid,
  1: berTlvTagFirstByteFf.valid,
};

const writeBehaviorCoding = {
  0b00: writeBehavior.oneTimeWrite,
  0b01: writeBehavior.proprietary,
  0b10: writeBehavior.writeOr,
  0b11: writeBehavior.writeAnd,
};

export function encode() {
  throw new Error('Not implemented');
}

export function decode(byte) {
  const b8 = (byte >> 7) & 1;
  const b7b6 = (byte >> 5) & 3;
  const b5 = (byte >> 4) & 1;
  const b4b1 = byte & 15;

  return {
    efsOfBerTlv: Boolean(b8),
    writeBehavior: writeBehaviorCoding[b7b6],
    berTlvTagFirstByteFf: berTlvTagFirstByteFfCoding[b5],
    dataUnitSizeInQuartets: 2 ** b4b1,
  };
}
