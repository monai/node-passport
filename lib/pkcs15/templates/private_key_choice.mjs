// ISO/IEC 7816-15:2016(E)
// -- A.4.1

import privateEcKey from './private_ec_key.mjs';

const template = {
  0x30: {
    name: 'privateRSAKey',
  },
  0xa0: {
    name: 'privateECKey',
    children: privateEcKey,
  },
  0xa1: {
    name: 'privateDHKey',
  },
  0xa2: {
    name: 'privateDSAKey',
  },
  0xa3: {
    name: 'privateKEAKey',
  },
  0xa4: {
    name: 'genericPrivateKey',
  },
};

export default template;
