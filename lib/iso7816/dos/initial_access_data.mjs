// ISO/IEC 7816-4:2013(E)
// 12.1.2 Initial data string recovery

import CommandApdu from '../command_apdu.mjs';

export function encode() {
  throw new Error('Not implemented');
}

export function decode(data) {
  if (data.length === 1) {
    return new CommandApdu(0x00, 0xb0, 0x00, 0x00, { le: data });
  }

  if (data.length === 2) {
    const byte0 = data[0];
    const byte1 = data[1];
    const efStructure = (byte0 >> 7) & 1;
    const sfi = byte0 & 0x1f;

    if (efStructure === 0) {
      return new CommandApdu(0x00, 0xb0, sfi === 0 ? 0x00 : byte0, 0x00, { le: byte1 });
    }

    return new CommandApdu(0x00, 0xb2, 0x01, (sfi << 3) & 0b110, { le: byte1 });
  }

  if (data.length === 5) {
    return CommandApdu.from(data);
  }

  throw new Error('Unsupported data length');
}
