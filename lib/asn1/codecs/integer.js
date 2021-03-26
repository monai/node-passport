module.exports = {
  encode,
  decode,
  inspect,
};

function encode() {

}

function decode(data) {
  const size = 4;
  const bitSize = BigInt(size * 8);

  let offset = size - (data.length % size);
  offset = offset === size ? 0 : offset;

  const chunks = Math.ceil(data.length / size);
  const aligned = Buffer.alloc(chunks * size);
  data.copy(aligned, offset);

  let num = 0n;
  for (let i = 0; i < chunks; i += 1) {
    offset = i * size;

    num <<= bitSize;
    num |= BigInt(aligned.readInt32BE(offset));
  }

  return num;
}

function inspect(data) {
  return decode(data);
}
