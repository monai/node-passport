// ISO/IEC 7816-15:2016(E)
// 7.4 EF.DIR

import securityFileOrObject from './security_file_or_object.mjs';

// CIODDO ::= SEQUENCE {
//   providerId            OBJECT IDENTIFIER OPTIONAL,
//   odfPath               Path OPTIONAL,
//   ciaInfoPath           [0] Path OPTIONAL,
//   aid                   [APPLICATION 15] OCTET STRING (SIZE(1..16)),
//                         (CONSTRAINED BY {-- Must be an AID in accordance with ISO/IEC 7816-4--})
//                         OPTIONAL
//   securityFileOrObject  SET OF SecurityFileOrObject OPTIONAL,
//   ... -- For future extensions
// } -- Context tag 1 is historical and shall not be used

// NOTE 2 In accordance with ISO/IEC 7816-4, and when present in an application template,
// the tag [APPLICATION 19] ('73') replaces the CIODDO SEQUENCE ('30') tag,
// due to implicit tagging. See D.8 for an example.

// In case the ICC wants to enforce a high level of privacy,
// CIODDO may only contain SecurityFileOrObject structure to indicate
// to the IFD the preliminary protocol(s) to perform.

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
