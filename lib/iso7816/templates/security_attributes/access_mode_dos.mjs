// BS ISO/IEC 7816-4:2013

// Table 32 — Coding of tags '81' to '8F' for access mode DOs
const accessModeDos = {
  0b1000: 'CLA',
  0b0100: 'INS',
  0b0010: 'P1',
  0b0001: 'P2',
};

// Table 31 — Coding of access mode DOs
const template = {
  0x80: {
    description: 'Access mode field',
  },
  0x81: {
    description: makeDescription(0x81),
  },
  0x82: {
    description: makeDescription(0x82),
  },
  0x83: {
    description: makeDescription(0x83),
  },
  0x84: {
    description: makeDescription(0x84),
  },
  0x85: {
    description: makeDescription(0x85),
  },
  0x86: {
    description: makeDescription(0x86),
  },
  0x87: {
    description: makeDescription(0x87),
  },
  0x88: {
    description: makeDescription(0x88),
  },
  0x89: {
    description: makeDescription(0x89),
  },
  0x8a: {
    description: makeDescription(0x8a),
  },
  0x8b: {
    description: makeDescription(0x8b),
  },
  0x8c: {
    description: makeDescription(0x8c),
  },
  0x8d: {
    description: makeDescription(0x8d),
  },
  0x8e: {
    description: makeDescription(0x8e),
  },
  0x8f: {
    description: makeDescription(0x8f),
  },
  0x9c: {
    description: 'Proprietary state machine description',
  },
};

export default template;

function makeDescription(identifier) {
  const parts = [];

  for (const [i, entry] of Object.entries(accessModeDos)) {
    if (identifier & i) {
      parts.push(entry);
    }
  }

  return `Command header description (${parts.join(', ')})`;
}
