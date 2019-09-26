const { createCipher, createDecipher } = require('./crypto');

module.exports = {
  mac,
  pad
};

function mac(key, message) {
  const size = message.length / 8;
  let y = Buffer.alloc(8);

  const keya = key.slice(0, 8);
  const keyb = key.slice(8, 16)

  let block = createCipher('des-cbc', keya, y);
  for (let i = 0; i < size; i++) {
    y = block(message.slice(i * 8, i * 8 + 8));
  }

  const a = createDecipher('des-ecb', keyb, null);
  const b = createCipher('des-ecb', keya, null);

  return a(b(y));
}

function pad(buffer) {
  const size = 8;
  const padBlock = Buffer.from([0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
  const left = size - (buffer.length % 8);
  return Buffer.concat([buffer, padBlock.slice(0, left)]);
}
