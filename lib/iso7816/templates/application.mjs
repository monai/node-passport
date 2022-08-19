// ISO/IEC 7816-4:2013

// 12.2.4 Application template and related data elements
// Table 122
const template = {
  0x4F: {
    description: 'Application identifier',
  },
  0x50: {
    description: 'Application label',
  },
  0x51: {
    description: 'File reference',
  },
  0x52: {
    description: 'Command APDU',
  },
  0x53: {
    description: 'Discretionary data',
  },
  0x73: {
    description: 'Discretionary template',
  },
  0x5F50: {
    description: 'Uniform resource locator',
  },
  0x61: {
    description: 'Set of application-related DOs',
    children: {
      0x79: {
        description: 'Coexistent tag allocation scheme',
      },
    },
  },
};

export default template;
