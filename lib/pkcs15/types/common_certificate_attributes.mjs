// ISO/IEC 7816-15:2016(E)
// 8.2.15 CommonCertificateAttributes; -- A.2.15

const type = {
  type: 'CommonCertificateAttributes',
  text: 'CommonCertificateAttributes ::= SEQUENCE',
  tag: 0x30,
  children: [
    {
      identifier: 'iD',
      text: 'Identifier',
      tag: 0x04,
    },
    {
      identifier: 'authority',
      text: 'BOOLEAN DEFAULT FALSE',
      tag: 0x02,
    },
    {
      identifier: 'identifier',
      text: 'CredentialIdentifier {{KeyIdentifiers}} OPTIONAL',
      tag: 0x00,
    },
    {
      identifier: 'certHash',
      text: '[0] CertHash OPTIONAL',
      tag: 0xa0,
    },
    {
      identifier: 'trustedUsage',
      text: '[1] Usage OPTIONAL',
      tag: 0xa1,
    },
    {
      identifier: 'identifiers',
      text: '[2] SEQUENCE OF CredentialIdentifier {{KeyIdentifiers}} OPTIONAL',
      tag: 0xa2,
    },
    {
      identifier: 'validity',
      text: '[4] Validity OPTIONAL',
      tag: 0xa4,
    },
  ],
};

export default type;
