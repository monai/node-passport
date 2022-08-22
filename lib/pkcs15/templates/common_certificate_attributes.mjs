// ISO/IEC 7816-15:2016(E)
// 8.2.15 CommonCertificateAttributes; -- A.2.15

const template = {
  0x04: {
    name: 'iD',
  },
  0x02: {
    name: 'identifier',
  },
  0xa0: {
    name: 'certHash',
  },
  0xa1: {
    name: 'trustedUsage',
  },
  0xa2: {
    name: 'identifiers',
  },
  0xa4: {
    name: 'validity',
  },
};

export default template;
