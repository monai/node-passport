// ISO/IEC 7816-15:2016(E)
// 8.5.1 PublicKeyChoice; -- A.5.1

import commonObjectAttributes from './common_object_attributes.mjs';
import commonKeyAttributes from './common_key_attributes.mjs';
import commonPublicKeyAttributes from './common_public_key_attributes.mjs';
import publicEcKeyAttributes from './public_ec_key_attributes.mjs';

const type = {
  type: 'PublicKeyObject {PrivateECKeyAttributes}',
  text: 'PublicKeyObject {KeyAttributes} ::= CIO {CommonKeyAttributes, CommonPublicKeyAttributes, KeyAttributes}',
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
      children: commonPublicKeyAttributes.children,
    },
    {
      identifier: 'typeAttributes',
      text: '[1] TypeAttributes',
      tag: 0xa1,
      children: publicEcKeyAttributes.children,
    },
  ],
};

export default type;
