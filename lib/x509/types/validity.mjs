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
    },
    {
      identifier: 'notAfter',
      text: 'Time',
    },
  ],
};

const choices = [];
for (const child of type.children) {
  for (const timeChoice of time.children) {
    choices.push({
      ...child,
      tag: timeChoice.tag,
    });
  }
}

type.children = choices;

export default type;
