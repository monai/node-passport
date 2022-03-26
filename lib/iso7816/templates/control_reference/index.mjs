// ISO/IEC 7816-4:2013
// 10.3.1 Control reference templates

import authentication from './authentication.mjs';
import keyAgreement from './key_agreement.mjs';
import hashCode from './hash_code.mjs';
import cryptographicChecksum from './cryptographic_checksum.mjs';
import digitalSignature from './digital_signature.mjs';
import confidenciality from './confidentiality.mjs';

const template = {
  0xA5: {
    description: 'Control reference template for authentication (AT)',
    children: authentication,
  },
  0xA4: {
    description: 'Control reference template for authentication (AT)',
    children: authentication,
  },
  0xA6: {
    description: 'Control reference template for key agreement (KAT)',
    children: keyAgreement,
  },
  0xA7: {
    description: 'Control reference template for key agreement (KAT)',
    children: keyAgreement,
  },
  0xAA: {
    description: 'Control reference template for hash-code (HT)',
    children: hashCode,
  },
  0xAB: {
    description: 'Control reference template for hash-code (HT)',
    children: hashCode,
  },
  0xB4: {
    description: 'Control reference template for cryptographic checksum (CCT)',
    children: cryptographicChecksum,
  },
  0xB5: {
    description: 'Control reference template for cryptographic checksum (CCT)',
    children: cryptographicChecksum,
  },
  0xB6: {
    description: 'Control reference template for digital signature (DST)',
    children: digitalSignature,
  },
  0xB7: {
    description: 'Control reference template for digital signature (DST)',
    children: digitalSignature,
  },
  0xB8: {
    description: 'Control reference template for confidentiality (CT)',
    children: confidenciality,
  },
  0xB9: {
    description: 'Control reference template for confidentiality (CT)',
    children: confidenciality,
  },
};

export default template;
