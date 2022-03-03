// ETSI TS 123 040 V16.0.0 (2020-07)
// 9.2.3.3 TP-Validity-Period-Format (TP-VPF)

export const notPresent = 'not present';
export const relativeFormat = 'relative format';
export const enhancedFormat = 'enhanced format';
export const absoluteFormat = 'absolute format';

const map = {
  0b00: notPresent,
  0b01: relativeFormat,
  0b10: enhancedFormat,
  0b11: absoluteFormat,
  notPresent: 0b00,
  relativeFormat: 0b01,
  enhancedFormat: 0b10,
  absoluteFormat: 0b11,
};

export function encode(data) {
  return map[data];
}

export function decode(data) {
  return data;
}

export function inspect(data) {
  return map[data];
}
