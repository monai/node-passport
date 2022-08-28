// ISO/IEC 7816-4:2013

// 12.2.4 Application template and related data elements
// Table 122

const type = {
  description: 'Application template',
  tag: 0x61,
  singleComponentType: true,
  children: [
    {
      tag: 0x4F,
      description: 'Application identifier',
    },
    {
      tag: 0x50,
      description: 'Application label',
    },
    {
      tag: 0x51,
      description: 'File reference',
    },
    {
      tag: 0x52,
      description: 'Command APDU',
    },
    {
      tag: 0x53,
      description: 'Discretionary data',
    },
    {
      tag: 0x73,
      description: 'Discretionary template',
    },
    {
      tag: 0x5F50,
      description: 'Uniform resource locator',
    },
    {
      tag: 0x61,
      description: 'Set of application-related DOs',
      children: [
        {
          tag: 0x79,
          description: 'Coexistent tag allocation scheme',
        },
      ],
    },
  ],
};

export default type;
