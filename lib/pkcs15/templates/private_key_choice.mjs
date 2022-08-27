// ISO/IEC 7816-15:2016(E)
// 8.4.1 PrivateKeyChoice; -- A.4.1

import privateEcKey from './private_ec_key.mjs';

const type = {
  type: 'PrivateKeyChoice',
  text: 'PrivateKeyChoice ::= CHOICE',
  singleComponentType: true,
  children: [
    {
      identifier: 'privateRSAKey',
      text: 'PrivateKeyObject {PrivateRSAKeyAttributes}',
      tag: 0x30,
    },
    {
      identifier: 'privateECKey',
      text: '[0] PrivateKeyObject {PrivateECKeyAttributes}',
      tag: 0xa0,
      children: privateEcKey.children,
    },
    {
      identifier: 'privateDHKey',
      text: '[1] PrivateKeyObject {PrivateDHKeyAttributes}',
      tag: 0xa1,
    },
    {
      identifier: 'privateDSAKey',
      text: '[2] PrivateKeyObject {PrivateDSAKeyAttributes}',
      tag: 0xa2,
    },
    {
      identifier: 'privateKEAKey',
      text: '[3] PrivateKeyObject {PrivateKEAKeyAttributes}',
      tag: 0xa3,
    },
    {
      identifier: 'genericPrivateKey',
      text: '[4] PrivateKeyObject {GenericKeyAttributes}',
      tag: 0xa4,
    },
  ],
};

export default type;
