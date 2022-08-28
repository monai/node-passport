// ISO/IEC 7816-15:2016(E)

import application4 from '../../iso7816/templates/application_type.mjs';
import cioddo from './cioddo.mjs';

// 7.4 EF.DIR
// NOTE 2 In accordance with ISO/IEC 7816-4, and when present in an application template,
// the tag [APPLICATION 19] ('73') replaces the CIODDO SEQUENCE ('30') tag,
// due to implicit tagging. See D.8 for an example.

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
