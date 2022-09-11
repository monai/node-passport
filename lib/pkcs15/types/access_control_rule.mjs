// ISO/IEC 7816-15:2016(E)
// 8.2.8 CommonObjectAttributes; -- A.2.8

import securityCondition from './security_condition.mjs';

const type = {
  type: 'AccessControlRule',
  text: 'AccessControlRule ::= SEQUENCE',
  tag: 0x30,
  children: [
    {
      identifier: 'accessMode',
      text: 'AccessMode',
      tag: 0x03,
    },
    {
      identifier: 'securityCondition',
      text: 'SecurityCondition',
      choices: securityCondition.children,
      singleComponentType: true, // TODO: is it implicit?
    },
    {
      identifier: 'communicationMode',
      text: 'CommunicationMode OPTIONAL',
      tag: 0x03,
    },
    {
      identifier: 'lifeCycleStatus',
      text: 'LifeCycleStatus OPTIONAL',
      tag: 0x0a,
    },
    {
      identifier: 'verifLimitDates',
      text: 'RangeOfDate OPTIONAL',
      tag: 0x30,
    },
  ],
};

export default type;
