module.exports = {
  encode,
  decode,
  inspect,
};

const readers = ['readInt8', 'readInt16BE', 'readInt32BE'];

function encode() {

}

function decode(data) {
  const reader = readers[data.length - 1];
  if (!reader) {
    throw new Error(`Unsupported integer length: ${data.length}`);
  }
  return [data[reader](), data.length];
}

function inspect(data) {
  return decode(data)[0];
}
