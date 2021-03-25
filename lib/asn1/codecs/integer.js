module.exports = {
  encode,
  decode,
  inspect,
};

function encode() {

}

function decode(data) {
  let offset = 4 - (data.length % 4);
  offset = offset === 4 ? 0 : offset;

  const chunks = Math.ceil(data.length / 4);
  const aligned = Buffer.alloc(chunks * 4);
  data.copy(aligned, offset);

  let num = 0n;
  for (let i = 0; i < chunks; i += 1) {
    offset = i * 4;

    num <<= 32n;
    num |= BigInt(aligned.readInt32BE(offset));
  }

  return num;
}

function inspect(data) {
  return decode(data);
}
