import { formatHex } from '../util.js';

// 7816-4:2013 5.6, Table 6
const errors = {
  0x62: {
    0x00: 'No information given',
    0x81: 'Part of returned data may be corrupted',
    0x82: 'End of file or record reached before reading Ne bytes, or unsuccessful search.',
    0x83: 'Selected file deactivated',
    0x84: 'File or data control information notformatted according to 7.4',
    0x85: 'Selected file in termination state',
    0x86: 'No input data available from a sensor on the card',
    0x87: 'At least one of the referenced records is deactivated',
    other: (sw2) => {
      if (sw2 >= 0x02 && sw2 <= 0x80) {
        return 'Triggering by the card (see 12.5.1)';
      }
      return undefined;
    },
  },
  0x63: {
    0x00: 'No information given',
    0x40: 'Unsuccessful comparison (exact meaning depends on the command)',
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
    0x00: 'No information given',
    0x01: 'Immediate response required by the card',
    0x81: 'Logical channel shared access denied',
    0x82: 'Logical channel opening denied',
    other: (sw2) => {
      if (sw2 >= 0x02 && sw2 <= 0x80) {
        return 'Triggering by the card (see 12.5.1)';
      }
      return undefined;
    },
  },
  0x65: {
    0x00: 'No information given',
    0x80: 'Memory failure',
  },
  0x66: {
    0x00: 'No information given',
  },
  0x67: {
    0x00: 'No information given',
    0x01: 'Command APDU format not compliant with this standard (see 5.1)',
    0x02: 'The value of Lc is not the one expected',
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
    0x87: 'Expected secure messaging DOs missing',
    0x88: 'Incorrect secure messaging DOs',
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
  0x6c: {
    other: (sw2) => `Wrong Le field; 0x${formatHex(sw2)} data bytes are available`,
  },
};

export default errors;
