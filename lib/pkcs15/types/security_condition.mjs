// ISO/IEC 7816-15:2016(E)
// 8.2.8 CommonObjectAttributes; -- A.2.8

import authReference from './auth_reference.mjs';

const type = {
  type: 'SecurityCondition',
  text: 'SecurityCondition ::= CHOICE',
  singleComponentType: true,
  children: [
    {
      identifier: 'always',
      text: 'NULL',
      tag: 0x05,
    },
    {
      identifier: 'authId',
      text: 'Identifier',
      tag: 0x04,
    },
    {
      identifier: 'authReference',
      text: 'AuthReference',
      tag: 0x30,
      children: authReference.children,
    },
    {
      identifier: 'not',
      text: '[0] SecurityCondition',
      tag: 0xa0,
      singleComponentType: true,
    },
    {
      identifier: 'and',
      text: '[1] SEQUENCE SIZE (2..cia-ub-securityConditions) OF SecurityCondition',
      tag: 0xa1,
      singleComponentType: true,
    },
    {
      identifier: 'or',
      text: '[2] SEQUENCE SIZE (2..cia-ub-securityConditions) OF SecurityCondition',
      tag: 0xa2,
      singleComponentType: true,
    },
  ],
};

type.children[3].children = type.children;
type.children[4].children = type.children;
type.children[5].children = type.children;

export default type;
