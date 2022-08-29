// ISO/IEC 9594-8:2020 (E)
// 7.2.1 Public-key certificate syntax

import time from './time.mjs';

const type = {
  type: 'Validity',
  text: 'Validity ::= SEQUENCE',
  tag: 0x30,
  children: [
    {
      identifier: 'notBefore',
      text: 'Time',
      choices: time.children,
    },
    {
      identifier: 'notAfter',
      text: 'Time',
      choices: time.children,
    },
  ],
};

export default type;
