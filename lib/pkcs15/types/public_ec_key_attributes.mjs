// ISO/IEC 7816-15:2016(E)
// 8.5.3 Public elliptic curve key attributes; -- A.5.3

const type = {
  type: 'PublicECKeyAttributes',
  text: 'PublicECKeyAttributes ::= SEQUENCE',
  tag: 0x30,
  children: [
    {
      identifier: 'value',
      text: 'ObjectValue {ECPublicKeyChoice}',
      tag: 0x30,
    },
    {
      identifier: 'keyInfo',
      text: 'KeyInfo {Parameters, PublicKeyOperations} OPTIONAL',
      tag: 0x30,
    },
  ],
};

export default type;
