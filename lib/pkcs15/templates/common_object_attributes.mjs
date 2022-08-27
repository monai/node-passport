// ISO/IEC 7816-15:2016(E)
// 8.2.8 CommonObjectAttributes; -- A.2.8

const type = {
  type: 'CommonObjectAttributes',
  text: 'CommonObjectAttributes ::= SEQUENCE',
  tag: 0x30,
  children: [
    {
      identifier: 'label',
      text: 'Label OPTIONAL',
      tag: 0x0c,
    },
    {
      identifier: 'flags',
      text: 'CommonObjectFlags OPTIONAL',
      tag: 0x03,
    },
    {
      identifier: 'authId',
      text: 'Identifier OPTIONAL',
      tag: 0x04,
    },
    {
      identifier: 'userConsent',
      text: 'INTEGER (1..cia-ub-userConsent) OPTIONAL',
      tag: 0x02,
    },
    {
      identifier: 'accessControlRules',
      text: 'SEQUENCE SIZE (1..MAX) OF AccessControlRule OPTIONAL',
      tag: 0x30,
    },
  ],
};

export default type;
