// ISO/IEC 7816-15:2016(E)
// 8.7.1 CertificateChoice; -- A.7.1

import commonObjectAttributes from './common_object_attributes.mjs';
import commonCertificateAttributes from './common_certificate_attributes.mjs';
import x509CertificateAttributes from './x509_certificate_attributes.mjs';

const type = {
  type: 'CertificateObject {CertAttributes}',
  text: 'CertificateObject {CertAttributes} ::= CIO {CommonCertificateAttributes, NULL, CertAttributes}',
  tag: 0x30,
  children: [
    {
      identifier: 'commonObjectAttributes',
      text: 'CommonObjectAttributes',
      tag: 0x30,
      children: commonObjectAttributes.children,
    },
    {
      identifier: 'classAttributes',
      text: 'ClassAttributes',
      tag: 0x30,
      children: commonCertificateAttributes.children,
    },
    {
      identifier: 'typeAttributes',
      text: '[1] TypeAttributes',
      tag: 0xa1,
      children: x509CertificateAttributes.children,
    },
  ],
};

export default type;
