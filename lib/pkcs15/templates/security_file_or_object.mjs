// ISO/IEC 7816-15:2016(E)
// 7.4 EF.DIR; -- A.11 CIO DDO
// Table C.1 — EF.DIR description with privacy enabling features (see topology on Figure C.5);

const type = {
  type: 'SecurityFileOrObject',
  text: 'SecurityFileOrObject ::= SEQUENCE',
  tag: 0x30,
  singleComponentType: true, // HACK: Support malformed SecurityFileOrObject values
  children: [
    {
      identifier: 'label',
      text: ' Label OPTIONAL',
      tag: 0x0c,
    },
    {
      identifier: 'communicationMode',
      text: ' CommunicationMode OPTIONAL',
      tag: 0x03,
    },
    {
      identifier: 'fileOrObjectPath',
      text: ' Path',
      tag: 0x30,
    },
    {
      identifier: 'protocol',
      text: ' OBJECT IDENTIFIER OPTIONAL',
      tag: 0x06,
    },
    {
      identifier: 'cioSecurityId',
      text: ' INTEGER OPTIONAL',
      tag: 0x02,
    },
    {
      identifier: 'index',
      text: '[0] INTEGER (0..cia-ub-index) OPTIONAL',
      tag: 0x80,
    },
    {
      identifier: 'precondition',
      text: '[1] INTEGER (0..cia-ub-index) OPTIONAL',
      tag: 0x81,
    },
  ],
};

export default type;
