// ISO/IEC 7816-15:2016(E)
// 8.2.9 CommonKeyAttributes; -- A.2.9

const type = {
  type: 'CommonKeyAttributes',
  text: 'CommonKeyAttributes ::= SEQUENCE',
  tag: 0x30,
  children: [
    {
      identifier: 'iD',
      text: 'Identifier',
      tag: 0x04,
    },
    {
      identifier: 'usage',
      text: 'KeyUsageFlags',
      tag: 0x03,
    },
    {
      identifier: 'native',
      text: 'BOOLEAN DEFAULT TRUE',
      tag: 0x01,
    },
    {
      identifier: 'accessFlags',
      text: 'KeyAccessFlags OPTIONAL',
      tag: 0x03,
    },
    {
      identifier: 'keyReference',
      text: 'KeyReference OPTIONAL',
      tag: 0x02,
    },
    {
      identifier: 'startDate',
      text: 'GeneralizedTime OPTIONAL',
      tag: 0x18,
    },
    {
      identifier: 'endDate',
      text: '[0] GeneralizedTime OPTIONAL',
      tag: 0xa0,
    },
    {
      identifier: 'algReference',
      text: '[1] SEQUENCE OF Reference OPTIONAL',
      tag: 0xa1,
    },

  ],
};

export default type;
