module.exports = {
  encode,
  decode,
};

function encode() {

}

function decode(tag, offset = 0) {
  const identifier = tag[offset];
  const klass = identifier >>> 6;
  const encoding = identifier >>> 5 & 0x01;
  let number = identifier & 0x1f;
  let read = 1;

  if (number === 0x1f) {
    number = 0;
    let byte;
    do {
      byte = tag[offset + read++];
      number = number << 8 ^ byte & 0x7f;
    } while (byte & 0x80);
  }

  tag = tag.slice(offset, offset + read);
  const pad = 4 - read;
  if (pad >= 0) {
    tag = Buffer.concat([Buffer.alloc(pad), tag]);
  }
  const tagNumber = tag.readInt32BE(offset);

  return [klass, encoding, number, tagNumber, read];
}
