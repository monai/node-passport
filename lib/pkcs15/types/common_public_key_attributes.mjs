// ISO/IEC 7816-15:2016(E)
// 8.2.11 CommonPpublicKeyAttributes; -- A.2.11

const type = {
  type: 'CommonPublicKeyAttributes',
  text: 'CommonPublicKeyAttributes ::= SEQUENCE',
  tag: 0x30,
  children: [
    {
      identifier: 'name',
      text: 'Name OPTIONAL',
      tag: 0x30,
    },
    {
      identifier: 'trustedUsage',
      text: '[0] Usage OPTIONAL',
      tag: 0xa0,
    },
    {
      identifier: 'generalName',
      text: '[1] GeneralNames OPTIONAL',
      tag: 0xa1,
    },
    {
      identifier: 'keyIdentifiers',
      text: '[2] SEQUENCE OF CredentialIdentifier {{KeyIdentifiers}} OPTIONAL',
      tag: 0xa2,
    },
  ],
};

export default type;
