// ISO/IEC 7816-15:2016(E)

import application4 from '../../iso7816/templates/application_type.mjs';
import cioddo from './cioddo.mjs';

const type = {
  ...application4,
  children: [
    ...application4.children.filter((node) => node.tag !== 0x73),
    {
      ...cioddo,
      tag: 0x73,
    },
  ],
};

export default type;
