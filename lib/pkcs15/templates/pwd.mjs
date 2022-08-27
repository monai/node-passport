// ISO/IEC 7816-15:2016(E)
// 8.9.1 AuthenticationObjectChoice; -- A.9.1

import commonObjectAttributes from './common_object_attributes.mjs';
import commonAuthenticationAttributes from './common_authentication_object_attributes.mjs';
import passwordAttributes from './password_attributes.mjs';

const type = {
  type: 'AuthenticationObject {AuthObjectAttributes}',
  text: 'AuthenticationObject {AuthObjectAttributes} ::= CIO {CommonAuthenticationObjectAttributes, NULL, AuthObjectAttributes}',
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
      children: commonAuthenticationAttributes.children,
    },
    {
      identifier: 'typeAttributes',
      text: '[1] TypeAttributes',
      tag: 0xa1,
      children: [passwordAttributes],
    },
  ],
};

export default type;
