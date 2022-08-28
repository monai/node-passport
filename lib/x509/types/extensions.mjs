// ISO/IEC 9594-8:2020 (E)
// 7.2.1 Public-key certificate syntax

import extension from './extension.mjs';

const type = {
  type: 'Extensions',
  text: 'Extensions ::= SEQUENCE SIZE (1..MAX) OF Extension',
  tag: 0x30,
  children: [
    extension,
  ],
};

export default type;
