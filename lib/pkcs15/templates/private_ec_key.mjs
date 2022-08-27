// ISO/IEC 7816-15:2016(E)
// 8.4.1 PrivateKeyChoice; -- A.4.1

import commonObjectAttributes from './common_object_attributes.mjs';
import commonKeyAttributes from './common_key_attributes.mjs';
import commonPrivateKeyAttributes from './common_private_key_attributes.mjs';
import privateEcKeyAttributes from './private_ec_key_attributes.mjs';

const type = {
  type: 'PrivateKeyObject {PrivateECKeyAttributes}',
  text: 'PrivateKeyObject {KeyAttributes} ::= CIO {CommonKeyAttributes, CommonPrivateKeyAttributes, KeyAttributes}',
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
      children: commonKeyAttributes.children,
    },
    {
      identifier: 'subClassAttributes',
      text: '[0] SubClassAttributes OPTIONAL',
      tag: 0xa0,
      children: commonPrivateKeyAttributes.children,
    },
    {
      identifier: 'typeAttributes',
      text: '[1] TypeAttributes',
      tag: 0xa1,
      children: privateEcKeyAttributes.children,
    },
  ],
};

export default type;
