const { formatHex } = require('../util');

const errors = {
  0x62: {
    0x00: 'No information given',
    0x81: 'Part of returned data may be corrupted',
    0x82: 'End of file or record reached before reading Ne bytes',
    0x83: 'Selected file deactivated',
    0x84: 'File control information not formatted according to 5.3.3',
    0x85: 'Selected file in termination state',
    0x86: 'No input data available from a sensor on the card',
  },
  0x63: {
    0x00: 'No information given',
    0x81: 'File filled up by the last write',
    0xc0: "Counter '0' (exact meaning depending on the command)",
    0xc1: "Counter '1' (exact meaning depending on the command)",
    0xc2: "Counter '2' (exact meaning depending on the command)",
    0xc3: "Counter '3' (exact meaning depending on the command)",
    0xc4: "Counter '4' (exact meaning depending on the command)",
    0xc5: "Counter '5' (exact meaning depending on the command)",
    0xc6: "Counter '6' (exact meaning depending on the command)",
    0xc7: "Counter '7' (exact meaning depending on the command)",
    0xc8: "Counter '8' (exact meaning depending on the command)",
    0xc9: "Counter '9' (exact meaning depending on the command)",
    0xca: "Counter 'a' (exact meaning depending on the command)",
    0xcb: "Counter 'b' (exact meaning depending on the command)",
    0xcc: "Counter 'c' (exact meaning depending on the command)",
    0xcd: "Counter 'd' (exact meaning depending on the command)",
    0xce: "Counter 'e' (exact meaning depending on the command)",
    0xcf: "Counter 'f' (exact meaning depending on the command)",
  },
  0x64: {
    0x00: 'Execution error',
    0x01: 'Immediate response required by the card',
  },
  0x65: {
    0x00: 'No information given',
    0x80: 'Memory failure',
  },
  0x68: {
    0x00: 'No information given',
    0x81: 'Logical channel not supported',
    0x82: 'Secure messaging not supported',
    0x83: 'Last command of the chain expected',
    0x84: 'Command chaining not supported',
  },
  0x69: {
    0x00: 'No information given',
    0x81: 'Command incompatible with file structure',
    0x82: 'Security status not satisfied',
    0x83: 'Authentication method blocked',
    0x84: 'Reference data not usable',
    0x85: 'Conditions of use not satisfied',
    0x86: 'Command not allowed (no current EF)',
    0x87: 'Expected secure messaging data objects missing',
    0x88: 'Incorrect secure messaging data objects',
  },
  0x6a: {
    0x00: 'No information given',
    0x80: 'Incorrect parameters in the command data field',
    0x81: 'Function not supported',
    0x82: 'File or application not found',
    0x83: 'Record not found',
    0x84: 'Not enough memory space in the file',
    0x85: 'Nc inconsistent with TLV structure',
    0x86: 'Incorrect parameters P1-P2',
    0x87: 'Nc inconsistent with parameters P1-P2',
    0x88: 'Referenced data or reference data not found (exact meaning depending on the command)',
    0x89: 'File already exists',
    0x8A: 'DF name already exists',
  },
  0x6c: (sw1, sw2) => `Wrong Le field; 0x${formatHex(sw2)} data bytes are available`,
};

class Iso7816Error extends Error {
  constructor(sw1, sw2) {
    if (Buffer.isBuffer(sw1) && sw1.length === 2) {
      [sw1, sw2] = sw1;
    }

    const number = `0x${[sw1, sw2].map(formatHex).join('')}`;
    let message;
    try {
      message = errors[sw1];
      if (typeof message === 'function') {
        message = message(sw1, sw2);
      } else {
        message = message[sw2];
      }
    // eslint-disable-next-line no-empty
    } catch (ex) {}
    message = message ? `${message} [${number}]` : `unknown error [${number}]`;
    super(message);
  }
}

module.exports = {
  errors,
  Iso7816Error,
};
