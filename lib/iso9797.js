import { createCipheriv, createDecipheriv } from 'crypto';

export function mac(key, message) {
  const size = message.length / 8;
  let y = Buffer.alloc(8);

  const keya = key.slice(0, 8);
  const keyb = key.slice(8, 16);

  const block = createCipheriv('des-cbc', keya, y);
  for (let i = 0; i < size; i += 1) {
    y = block.update(message.slice(i * 8, i * 8 + 8));
  }

  const desb = createDecipheriv('des-ede3-ecb', Buffer.concat([keyb, keyb, keyb]), null);
  const desa = createCipheriv('des-ede3-ecb', Buffer.concat([keya, keya, keya]), null);

  desb.setAutoPadding(false);
  desa.setAutoPadding(false);

  return desa.update(desb.update(y));
}

export function pad(buffer) {
  const size = 8;
  const padBlock = Buffer.from([0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
  const left = size - (buffer.length % size);
  return Buffer.concat([buffer, padBlock.slice(0, left)]);
}

export function unpad(buffer) {
  const index = buffer.lastIndexOf(0x80);
  return buffer.length - index > 8 ? buffer : buffer.slice(0, index);
}
