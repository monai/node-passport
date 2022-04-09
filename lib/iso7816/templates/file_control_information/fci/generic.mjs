// BS ISO/IEC 7816-4:2013

// Table 8 — Interindustry templates for file control information
const template = {
  0x62: {
    name: 'fcp',
    description: 'Set of file control parameters (FCP template)',
  },
  0x64: {
    name: 'fmd',
    description: 'Set of file management data (FMD template)',
  },
  0x6F: {
    name: 'fci',
    description: 'Set of file control parameters and file management data (FCI template)',
  },
};

export default template;
