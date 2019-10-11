const crypto = require('crypto');

module.exports = {
  mac,
  pad,
  unpad,
};

function mac(key, message) {
  const size = message.length / 8;
  let y = Buffer.alloc(8);

  const keya = key.slice(0, 8);
  const keyb = key.slice(8, 16)

  const block = crypto.createCipheriv('des-cbc', keya, y);
  for (let i = 0; i < size; i++) {
    y = block.update(message.slice(i * 8, i * 8 + 8))
  }

  const desb = crypto.createDecipheriv('des-ede3-ecb', Buffer.concat([keyb, keyb, keyb]), null);
  const desa = crypto.createCipheriv('des-ede3-ecb', Buffer.concat([keya, keya, keya]), null);

  desb.setAutoPadding(false);
  desa.setAutoPadding(false);

  return desa.update(desb.update(y));
}

function pad(buffer) {
  const size = 8;
  const padBlock = Buffer.from([0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
  const left = size - buffer.length % 8;
  return Buffer.concat([buffer, padBlock.slice(0, left)]);
}

function unpad(buffer) {
  const index = buffer.lastIndexOf(0x80);
  return (index > -1) ? buffer.slice(0, index) : buffer;
}
