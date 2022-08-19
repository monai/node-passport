// ISO/IEC 7816-15:2016(E)
// 8.3 CIOChoice type

import { create as createPathOrObjects } from './path_or_objects.mjs';

// CIOChoice ::= CHOICE {
//   privateKeys           [0] PrivateKeys,
//   publicKeys            [1] PublicKeys,
//   trustedPublicKeys     [2] PublicKeys,
//   secretKeys            [3] SecretKeys,
//   certificates          [4] Certificates,
//   trustedCertificates   [5] Certificates,
//   usefulCertificates    [6] Certificates,
//   dataContainerObjects  [7] DataContainerObjects,
//   authObjects           [8] AuthObjects,
//   ... -- For future extensions
// }
// PrivateKeys ::=   PathOrObjects {PrivateKeyChoice}
// PublicKeys ::=    PathOrObjects {PublicKeyChoice}
// SecretKeys ::=    PathOrObjects {SecretKeyChoice}
// Certificates ::=  PathOrObjects {CertificateChoice}
// DataContainerObjects ::= PathOrObjects {DataContainerObjectChoice}
// AuthObjects ::=   PathOrObjects {AuthenticationObjectChoice}

const template = {
  0xa0: {
    name: 'privateKeys',
    description: 'Private keys',
    children: createPathOrObjects('PrivateKeyChoice'),
  },
  0xa1: {
    name: 'publicKeys',
    description: 'Public keys',
    children: createPathOrObjects('PublicKeyChoice'),
  },
  0xa2: {
    name: 'trustedPublicKeys',
    description: 'Trusted public keys',
    children: createPathOrObjects('PublicKeyChoice'),
  },
  0xa3: {
    name: 'secretKeys',
    description: 'Secret keys',
    children: createPathOrObjects('SecretKeyChoice'),
  },
  0xa4: {
    name: 'certificates',
    description: 'Certificates',
    children: createPathOrObjects('CertificateChoice'),
  },
  0xa5: {
    name: 'trustedCertificates',
    description: 'Trusted certificates',
    children: createPathOrObjects('CertificateChoice'),
  },
  0xa6: {
    name: 'usefulCertificates',
    description: 'Useful certificates',
    children: createPathOrObjects('CertificateChoice'),
  },
  0xa7: {
    name: 'dataContainerObjects',
    description: 'Data container objects',
    children: createPathOrObjects('DataContainerObjectChoice'),
  },
  0xa8: {
    name: 'authObjects',
    description: 'Authentication objects',
    children: createPathOrObjects('AuthenticationObjectChoice'),
  },
};

export default template;
