// ISO/IEC 9594-8:2020 (E)
// 7.2.1 Public-key certificate syntax

import algorithmIdentifier from './algorithm_identifier.mjs';
import subjectPublicKeyInfo from './subject_public_key_info.mjs';
import validity from './validity.mjs';
import extensions from './extensions.mjs';
import name from '../../x501/types/name.mjs';

const type = {
  type: 'TBSCertificate',
  text: 'TBSCertificate ::= SEQUENCE',
  tag: 0x30,
  children: [
    {
      identifier: 'version',
      text: '[0] Version DEFAULT v1',
      tag: 0xa0,
    },
    {
      identifier: 'serialNumber',
      text: 'CertificateSerialNumber',
      tag: 0x02,
    },
    {
      identifier: 'signature',
      text: 'AlgorithmIdentifier {{SupportedAlgorithms}}',
      tag: 0x30,
      children: algorithmIdentifier.children,
    },
    {
      identifier: 'issuer',
      text: 'Name',
      tag: 0x30,
      children: name.children,
    },
    {
      identifier: 'validity',
      text: 'Validity',
      tag: 0x30,
      children: validity.children,
    },
    {
      identifier: 'subject',
      text: 'Name',
      tag: 0x30,
      children: name.children,
    },
    {
      identifier: 'subjectPublicKeyInfo',
      text: 'SubjectPublicKeyInfo',
      tag: 0x30,
      children: subjectPublicKeyInfo.children,
    },
    {
      identifier: 'issuerUniqueIdentifier',
      text: '[1] IMPLICIT UniqueIdentifier OPTIONAL',
      tag: 0x81,
    },
    {
      identifier: 'subjectUniqueIdentifier',
      text: '[2] IMPLICIT UniqueIdentifier OPTIONAL',
      tag: 0x82,
    },
    {
      identifier: 'extensions',
      text: '[3] Extensions OPTIONAL',
      tag: 0xa3,
      children: [extensions],
    },
  ],
};

export default type;
