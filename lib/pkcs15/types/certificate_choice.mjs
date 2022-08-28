// ISO/IEC 7816-15:2016(E)
// 8.7.1 CertificateChoice; -- A.7.1

import x509Certificate from './x509_certificate.mjs';

const type = {
  type: 'CertificateChoice',
  text: 'CertificateChoice ::= CHOICE',
  singleComponentType: true,
  children: [
    {
      identifier: 'x509Certificate',
      text: 'CertificateObject {X509CertificateAttributes}',
      tag: 0x30,
      children: x509Certificate.children,
    },
    {
      identifier: 'x509AttributeCertificate',
      text: '[0] CertificateObject {X509AttributeCertificateAttributes}',
      tag: 0xa0,
    },
    {
      identifier: 'spkiCertificate',
      text: '[1] CertificateObject {SPKICertificateAttributes}',
      tag: 0xa1,
    },
    {
      identifier: 'pgpCertificate',
      text: '[2] CertificateObject {PGPCertificateAttributes}',
      tag: 0xa2,
    },
    {
      identifier: 'wtlsCertificate',
      text: '[3] CertificateObject {WTLSCertificateAttributes}',
      tag: 0xa3,
    },
    {
      identifier: 'x9-68Certificate',
      text: '[4] CertificateObject {X9-68CertificateAttributes}',
      tag: 0xa4,
    },
    {
      identifier: 'cvCertificate',
      text: ' [5] CertificateObject {CVCertificateAttributes}',
      tag: 0xa5,
    },
    {
      identifier: 'genericCertificateObject',
      text: '[6] CertificateObject {GenericCertificateAttributes}',
      tag: 0xa6,
    },
  ],
};

export default type;
