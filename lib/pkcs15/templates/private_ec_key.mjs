// ISO/IEC 7816-15:2016(E)
// 8.4.1 PrivateKeyChoice; -- A.4.1

import commonObjectAttributes from './common_object_attributes.mjs';
import commonKeyAttributes from './common_key_attributes.mjs';
import commonPrivateKeyAttributes from './common_private_key_attributes.mjs';
import privateEcKeyAttributes from './private_ec_key_attributes.mjs';

const template = {
  0x30: (node) => {
    const index = node.parent.children.indexOf(node);

    if (index === 0) {
      return {
        name: 'commonObjectAttributes',
        children: commonObjectAttributes,
      };
    }

    if (index === 1) {
      return {
        name: 'classAttributes',
        children: commonKeyAttributes,
      };
    }

    return undefined;
  },
  0xa0: {
    name: 'subClassAttributes',
    children: commonPrivateKeyAttributes,
  },
  0xa1: {
    name: 'typeAttributes',
    children: privateEcKeyAttributes,
  },
};

export default template;
