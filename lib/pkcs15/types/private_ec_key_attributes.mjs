// ISO/IEC 7816-15:2016(E)
// 8.4.3 Private elliptic curve key attributes; -- A.4.3

const type = {
  type: 'PrivateECKeyAttributes',
  text: 'PrivateECKeyAttributes ::= SEQUENCE',
  tag: 0x30,
  children: [
    {
      identifier: 'value',
      text: 'Path',
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
