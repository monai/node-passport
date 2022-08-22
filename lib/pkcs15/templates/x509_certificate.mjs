// ISO/IEC 7816-15:2016(E)
// 8.7.1 CertificateChoice; -- A.5.1

import commonObjectAttributes from './common_object_attributes.mjs';
import commonCertificateAttributes from './common_certificate_attributes.mjs';
import x509CertificateAttributes from './x509_certificate_attributes.mjs';

const template = {
  0x30: (node) => {
    const index = node.parent.children.indexOf(node);

    if (index === 0) {
      return {
        name: 'commonObjectAttributes',
        children: commonObjectAttributes,
      };
    }

    if (index === 1) {
      return {
        name: 'classAttributes',
        children: commonCertificateAttributes,
      };
    }

    return undefined;
  },
  0xa1: {
    name: 'typeAttributes',
    children: x509CertificateAttributes,
  },
};

export default template;
