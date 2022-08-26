// ISO/IEC 7816-15:2016(E)
// 8.9.1 AuthenticationObjectChoice; -- A.9.1

import pwd from './pwd.mjs';

const template = {
  0x30: {
    name: 'pwd',
    children: pwd,
  },
  0xa0: {
    name: 'biometricTemplate',
  },
  0xa1: {
    name: 'authKey',
  },
  0xa2: {
    name: 'external',
  },
  0xa3: {
    name: 'internal',
  },
};

export default template;
