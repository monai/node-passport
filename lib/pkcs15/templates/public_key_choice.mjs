// ISO/IEC 7816-15:2016(E)
// 8.5.1 PublicKeyChoice; -- A.5.1

import publicEcKey from './public_ec_key.mjs';

const type = {
  type: 'PrivateKeyChoice',
  text: 'PrivateKeyChoice ::= CHOICE',
  singleComponentType: true,
  children: [
    {
      identifier: 'publicRSAKey',
      text: 'PublicKeyObject {PublicRSAKeyAttributes}',
      tag: 0x30,
    },
    {
      identifier: 'publicECKey',
      text: '[0] PublicKeyObject {PublicECKeyAttributes}',
      tag: 0xa0,
      children: publicEcKey.children,
    },
    {
      identifier: 'publicDHKey',
      text: '[1] PublicKeyObject {PublicDHKeyAttributes}',
      tag: 0xa1,
    },
    {
      identifier: 'publicDSAKey',
      text: '[2] PublicKeyObject {PublicDSAKeyAttributes}',
      tag: 0xa2,
    },
    {
      identifier: 'publicKEAKey',
      text: '[3] PublicKeyObject {PublicKEAKeyAttributes}',
      tag: 0xa3,
    },
    {
      identifier: 'genericPublicKey',
      text: '[4] PublicKeyObject {GenericKeyAttributes}',
      tag: 0xa4,
    },
  ],
};

export default type;
