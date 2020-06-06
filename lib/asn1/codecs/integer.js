module.exports = {
  encode,
  decode,
  inspect,
};

const readers = ['readIntBE', 'readInt16BE', 'readInt32Be'];

function encode() {

}

function decode(data) {
  const reader = reader[data.length - 1];
  if (!reader) {
    throw new Error(`Unsupported integer length: ${data.length}`);
  }
  return [data[reader](), data.length];
}

function inspect(data) {
  const [val, rl] = decode(data);
  return val.toString();
}
