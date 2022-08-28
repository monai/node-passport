// ISO/IEC 9594-8:2020 (E)
// 7.2.1 Public-key certificate syntax

const type = {
  type: 'Extension',
  text: 'Extension ::= SEQUENCE',
  tag: 0x30,
  children: [
    {
      identifier: 'extnId',
      text: 'EXTENSION.&id ({ExtensionSet})',
      tag: 0x06,
    },
    {
      identifier: 'critical',
      text: 'BOOLEAN DEFAULT FALSE',
      tag: 0x01,
    },
    {
      identifier: 'extnValue',
      text: 'OCTET STRING (CONTAINING EXTENSION.&ExtnType ({ExtensionSet} {@extnId}) ENCODED BY der)',
      tag: 0x04,
    },
  ],
};

export default type;
