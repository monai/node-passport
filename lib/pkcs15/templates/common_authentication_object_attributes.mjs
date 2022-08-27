// ISO/IEC 7816-15:2016(E)
// 8.2.18 CommonAuthenticationObjectAttributes; -- A.2.18

const type = {
  type: 'CommonAuthenticationObjectAttributes',
  text: 'CommonAuthenticationObjectAttributes ::= SEQUENCE',
  tag: 0x30,
  children: [
    {
      identifier: 'authId',
      text: 'Identifier OPTIONAL',
      tag: 0x04,
    },
    {
      identifier: 'authReference',
      text: 'Reference OPTIONAL',
      tag: 0x02,
    },
    {
      identifier: 'seIdentifier',
      text: '[0] Reference OPTIONAL',
      tag: 0xa0,
    },
  ],
};

export default type;
