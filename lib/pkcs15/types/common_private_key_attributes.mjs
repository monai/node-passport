// ISO/IEC 7816-15:2016(E)
// 8.2.10 CommonPrivateKeyAttributes; -- A.2.10

const type = {
  type: 'CommonPrivateKeyAttributes',
  text: 'CommonPrivateKeyAttributes ::= SEQUENCE',
  tag: 0x30,
  children: [
    {
      identifier: 'name',
      text: 'Name OPTIONAL',
      tag: 0x30,
    },
    {
      identifier: 'keyIdentifiers',
      text: '[0] SEQUENCE OF CredentialIdentifier {{KeyIdentifiers}} OPTIONAL',
      tag: 0xa0,
    },
    {
      identifier: 'generalName',
      text: '[1] GeneralNames OPTIONAL',
      tag: 0xa1,
    },
    {
      identifier: 'keyUsageConstraints',
      text: '[2] KeyUsageConstraints OPTIONAL',
      tag: 0xa2,
    },
  ],
};

export default type;
