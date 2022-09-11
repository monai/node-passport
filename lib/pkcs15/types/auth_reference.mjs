// ISO/IEC 7816-15:2016(E)
// 8.2.8 CommonObjectAttributes; -- A.2.8

const type = {
  type: 'AuthReference',
  text: 'AuthReference ::= SEQUENCE',
  tag: 0x30,
  children: [
    {
      identifier: 'authMethod',
      text: 'AuthMethod',
      tag: 0x03,
    },
    {
      identifier: 'seIdentifier',
      text: 'INTEGER OPTIONAL',
      tag: 0x02,
    },
  ],
};

export default type;
