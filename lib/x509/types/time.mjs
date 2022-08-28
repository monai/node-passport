// ISO/IEC 9594-8:2020 (E)
// 7.2.1 Public-key certificate syntax

const type = {
  type: 'Time',
  text: 'Time ::= CHOICE',
  singleComponentType: true,
  children: [
    {
      identifier: 'utcTime',
      text: 'UTCTime',
      tag: 0x17,
    },
    {
      identifier: 'generalizedTime',
      text: 'GeneralizedTime',
      tag: 0x18,
    },
  ],
};

export default type;
