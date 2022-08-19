// ISO/IEC 7816-15:2016(E)

import efDir from '../../iso7816/templates/ef_dir.mjs';
import application from './application.mjs';

const template = {
  0x61: {
    ...efDir[0x61],
    children: application,
  },
};

export default template;
