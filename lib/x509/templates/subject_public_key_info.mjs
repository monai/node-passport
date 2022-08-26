// ISO/IEC 9594-8:2017 (E)
// 7.2 Public-key certificate

import algorithmIdentifier from './algorithm_identifier.mjs';

const template = {
  0x30: {
    name: 'SubjectPublicKeyInfo',
    children: {
      0x30: {
        name: 'algorithm',
        ...algorithmIdentifier[0x30],
      },
      0x03: {
        name: 'subjectPublicKey',
      },
    },
  },
};

export default template;
