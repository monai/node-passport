const crypto = require('crypto');
const { algorithm, mode } = require('cryptian');

module.exports = {
  mac,
  pad
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

  const desb = new algorithm.Des();
  desb.setKey(keyb);
  const tdesb = new mode.ecb.Decipher(desb, Buffer.alloc(0));
  const b = tdesb.transform(y);

  const desa = new algorithm.Des();
  desa.setKey(keya);
  const tdesa = new mode.ecb.Cipher(desa, Buffer.alloc(0));
  const a = tdesa.transform(b);

  return a
}

function pad(buffer) {
  const size = 8;
  const padBlock = Buffer.from([0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
  const left = size - (buffer.length % 8);
  return Buffer.concat([buffer, padBlock.slice(0, left)]);
}
