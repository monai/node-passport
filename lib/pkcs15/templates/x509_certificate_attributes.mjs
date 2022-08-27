// ISO/IEC 7816-15:2016(E)
// 8.7.2 X.509 certificate attributes; -- A.7.2

const type = {
  type: 'X509CertificateAttributes',
  text: 'X509CertificateAttributes ::= SEQUENCE',
  tag: 0x30,
  children: [
    {
      identifier: 'value',
      text: 'ObjectValue {Certificate}',
      tag: 0x30,
    },
    {
      identifier: 'subject',
      text: 'Name OPTIONAL',
      tag: 0x30,
    },
    {
      identifier: 'issuer',
      text: '[0] Name OPTIONAL',
      tag: 0xa0,
    },
    {
      identifier: 'serialNumber',
      text: 'CertificateSerialNumber OPTIONAL',
      tag: 0x02,
    },
  ],
};

export default type;
