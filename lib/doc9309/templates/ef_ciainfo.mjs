// ISO/IEC 7816-15:2016(E)
// 8.10 Cryptographic information file, EF.CIAInfo

import ciainfo from './ciainfo.mjs';

const template = {
  0x30: {
    description: 'CIAInfo',
    children: ciainfo,
  },
};

export default template;
