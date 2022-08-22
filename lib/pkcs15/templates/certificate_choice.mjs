// ISO/IEC 7816-15:2016(E)
// 8.7.1 CertificateChoice; -- A.7.1

import x509Certificate from './x509_certificate.mjs';

const template = {
  0x30: {
    name: 'x509Certificate',
    children: x509Certificate,
  },
  0xa0: {
    name: 'x509AttributeCertificate',
  },
  0xa1: {
    name: 'spkiCertificate',
  },
  0xa2: {
    name: 'pgpCertificate',
  },
  0xa3: {
    name: 'wtlsCertificate',
  },
  0xa4: {
    name: 'x9-68Certificate',
  },
  0xa5: {
    name: 'cvCertificate',
  },
  0xa6: {
    name: 'genericCertificateObject',
  },
};

export default template;
