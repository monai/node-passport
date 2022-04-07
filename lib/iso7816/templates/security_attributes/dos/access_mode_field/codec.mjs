import Bitset from '../../../../../bitset.mjs';

export const inspect = decode;

export function encode() {
  throw new Error('Not implemented');
}

export function decode(data, { labels: { one, more } }) {
  if (data[0] === 0x00) {
    data = data.slice(1);

    return decodeMoreBytes(data, more);
  }

  return decodeOneByte(data, one);
}

function decodeOneByte(data, labels) {
  const byte = data[0];
  const b8 = (data[0] >> 7) & 1;
  const isProprietary = b8 === 1;
  const length = isProprietary ? 3 : 7;

  const accessModeField = decodeAccessModeByte(byte, isProprietary, length, labels);

  return [
    accessModeField,
  ];
}

function decodeMoreBytes(data, labels) {
  const out = [];

  for (const [n, byte] of data.entries()) {
    const b7 = (byte >> 6) & 1;
    const isProprietary = b7 === 1;
    const length = isProprietary ? 0 : 6;

    const accessModeField = decodeAccessModeByte(byte, isProprietary, length, labels);
    out.push(accessModeField);

    if (byte & 0x80) {
      data = data.slice(n + 1);
      break;
    }
  }

  return out;
}

function decodeAccessModeByte(byte, isProprietary, length, { bitmap, proprietary }) {
  const data = Bitset.from(byte, 8);
  const labels = selectLabels(data, length, bitmap);
  if (isProprietary) {
    labels.push(proprietary);
  }

  return {
    data,
    labels,
  };
}

function selectLabels(amb, length, labels) {
  const out = [];
  for (let i = 0; i < length; i += 1) {
    if (amb.test(i)) {
      out.push(labels[i]);
    }
  }

  return out;
}
