// ISO/IEC 7816-15:2016(E)

// Table C.1 — EF.DIR description with privacy enabling features (see topology on Figure C.5)
const template = {
  0x0C: {
    name: 'label',
    description: 'Security file or object identifier',
  },
  0x03: {
    name: 'communicationMode',
    description: 'Physical interface',
  },
  0x30: {
    name: 'fileOrObjectPath',
    description: 'Path to the file or data object',
  },
  0x02: {
    name: 'cioSecurityId',
    description: 'Authentication object identifier',
  },
  0x06: {
    name: 'protocol',
    description: 'Protocol',
  },
  0xA0: {
    name: 'index',
    description: 'Attribute index',
  },
  0xA1: {
    name: 'precondition',
    description: 'Cross-reference to the index',
  },
};

export default template;
