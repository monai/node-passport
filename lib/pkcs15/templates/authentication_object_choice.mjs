// ISO/IEC 7816-15:2016(E)
// 8.9.1 AuthenticationObjectChoice; -- A.9.1

import pwd from './pwd.mjs';

const type = {
  type: 'PrivateKeyChoice',
  text: 'PrivateKeyChoice ::= CHOICE',
  singleComponentType: true,
  children: [
    {
      identifier: 'pwd',
      text: 'AuthenticationObject {PasswordAttributes}',
      tag: 0x30,
      children: pwd.children,
    },
    {
      identifier: 'biometricTemplate',
      text: '[0] AuthenticationObject {BiometricAttributes}',
      tag: 0xa0,
    },
    {
      identifier: 'authKey',
      text: '[1] AuthenticationObject {AuthKeyAttributes}',
      tag: 0xa1,
    },
    {
      identifier: 'external',
      text: '[2] AuthenticationObject {ExternalAuthObjectAttributes}',
      tag: 0xa2,
    },
    {
      identifier: 'internal',
      text: '[3] AuthenticationObject {InternalAuthObjectAttributes}',
      tag: 0xa3,
    },
  ],
};

export default type;
