// ISO/IEC 7816-15:2016(E)

import application from '../../iso7816/templates/application.mjs';
import cioddo from './cioddo.mjs';

const template = {
  ...application,
  0x73: {
    description: 'CIODDO',
    children: cioddo,
  },
};

export default template;
