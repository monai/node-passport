// ISO/IEC 7816-4:2013(E)
// 12.7.1 Extended length information

const type = {
  description: 'Extended length information',
  tag: 0x7f66,
  children: [
    {
      description: 'Command APDU max Nc',
      tag: 0x02,
    },
    {
      description: 'Response APDU max Ne',
      tag: 0x02,
    },
  ],
};

export default type;
