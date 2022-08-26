// ISO/IEC 7816-15:2016(E)
// 8.2.18 CommonAuthenticationObjectAttributes; -- A.2.18

const template = {
  0x04: {
    name: 'authId',
  },
  0x02: {
    name: 'authReference',
  },
  0xa1: {
    name: 'authReference',
  },
  0xa0: {
    name: 'seIdentifier',
  },
};

export default template;
