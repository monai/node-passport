export const inspect = decode;

export function encode() {
  throw new Error('Not implemented');
}

export function decode(data) {
  const size = 4;
  const bitSize = BigInt(size * 8);

  let offset = size - (data.length % size);
  offset = offset === size ? 0 : offset;

  const chunks = Math.ceil(data.length / size);
  const aligned = Buffer.alloc(chunks * size);
  data.copy(aligned, offset);

  const readers = ['readInt32BE', 'readUInt32BE'];

  let num = 0n;
  for (let i = 0; i < chunks; i += 1) {
    offset = i * size;

    const reader = readers[+!!i];
    num <<= bitSize;
    num |= BigInt(aligned[reader](offset));
  }

  return num;
}
