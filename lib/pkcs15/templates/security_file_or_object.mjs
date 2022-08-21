// ISO/IEC 7816-15:2016(E)

// Table C.1 — EF.DIR description with privacy enabling features (see topology on Figure C.5)
const template = {
  0x0C: {
    name: 'label',
  },
  0x03: {
    name: 'communicationMode',
  },
  0x30: {
    name: 'fileOrObjectPath',
  },
  0x02: {
    name: 'cioSecurityId',
  },
  0x06: {
    name: 'protocol',
  },
  0xA0: {
    name: 'index',
  },
  0xA1: {
    name: 'precondition',
  },
};

export default template;
