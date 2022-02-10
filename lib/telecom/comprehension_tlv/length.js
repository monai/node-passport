// ETSI TS 101 220 V16.0.0 (2021-04)

export function encode() {
  throw new Error('Not implemented');
}

// 7.1.2 Length encoding
export function decode(data) {
  const firstByte = data[0];

  if (firstByte < 0x7f) {
    return [firstByte, 1];
  }

  if (firstByte === 0x81) {
    return [data[1], 2];
  }

  if (firstByte === 0x82) {
    return [data.slice(1).readUInt16BE(), 3];
  }

  if (firstByte === 0x83) {
    return [data.slice(1).readUInt32BE() & 0xffffff, 4];
  }

  throw new Error(`Unknown coding ${data.slice(0, 1).toString('hex')}`);
}
