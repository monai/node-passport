// ISO/IEC 9594-8:2020 (E)
// 7.2.1 Public-key certificate syntax

import algorithmIdentifier from './algorithm_identifier.mjs';

const type = {
  type: 'SubjectPublicKeyInfo',
  text: 'SubjectPublicKeyInfo ::= SEQUENCE',
  tag: 0x30,
  children: [
    {
      identifier: 'algorithm',
      text: 'AlgorithmIdentifier {{SupportedAlgorithms}}',
      tag: 0x30,
      children: algorithmIdentifier.children,
    },
    {
      identifier: 'subjectPublicKey',
      text: 'PublicKey',
      tag: 0x03,
    },
  ],
};

export default type;
