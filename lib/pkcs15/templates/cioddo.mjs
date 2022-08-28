// ISO/IEC 7816-15:2016(E)
// 7.4 EF.DIR

import securityFileOrObject from './security_file_or_object.mjs';

const type = {
  type: 'CIODDO',
  text: 'CIODDO ::= SEQUENCE',
  tag: 0x30,
  children: [
    {
      identifier: 'providerId',
      text: 'OBJECT IDENTIFIER OPTIONAL',
      tag: 0x06,
    },
    {
      identifier: 'odfPath',
      text: 'Path OPTIONAL',
      tag: 0x30,
    },
    {
      identifier: 'ciaInfoPath',
      text: '[0] Path OPTIONAL',
      tag: 0xa0,
    },
    {
      identifier: 'aid',
      text: '[APPLICATION 15] OCTET STRING (SIZE(1..16)), (CONSTRAINED BY {-- Must be an AID in accordance with ISO/IEC 7816-4--}) OPTIONAL',
      tag: 0x4f,
    },
    {
      identifier: 'securityFileOrObject',
      text: 'SET OF SecurityFileOrObject OPTIONAL',
      tag: 0x31,
      children: [securityFileOrObject],
    },
  ],
};

export default type;
