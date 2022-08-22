// ISO/IEC 7816-15:2016(E)
// 8.5.1 PublicKeyChoice; -- A.5.1

import publicEcKey from './public_ec_key.mjs';

const template = {
  0x30: {
    name: 'publicRSAKey',
  },
  0xa0: {
    name: 'publicECKey',
    children: publicEcKey,
  },
  0xa1: {
    name: 'publicDHKey',
  },
  0xa2: {
    name: 'publicDSAKey',
  },
  0xa3: {
    name: 'publicKEAKey',
  },
  0xa4: {
    name: 'genericPublicKey',
  },
};

export default template;
