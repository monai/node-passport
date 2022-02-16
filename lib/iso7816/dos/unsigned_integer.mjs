export function encode() {
  throw new Error('Not implemented');
}

export function decode(data) {
  return data.readUIntBE(0, data.length);
}
