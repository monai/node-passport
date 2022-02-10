export const inspect = decode;

export function encode() {
  throw new Error('Not implemented');
}

export function decode(data) {
  return data[0] > 0;
}
