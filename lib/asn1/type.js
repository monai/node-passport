const type = {
  /*  0 */ 0x00: 'EOC',
  /*  1 */ 0x01: 'BOOLEAN',
  /*  2 */ 0x02: 'INTEGER',
  /*  3 */ 0x03: 'BIT STRING',
  /*  4 */ 0x04: 'OCTET STRING',
  /*  5 */ 0x05: 'NULL',
  /*  6 */ 0x06: 'OBJECT', // IDENTIFIER
  /*  7 */ 0x07: 'ObjectDescriptor',
  /*  8 */ 0x08: 'EXTERNAL',
  /*  9 */ 0x09: 'REAL',
  /* 10 */ 0x0a: 'ENUMERATED',
  /* 11 */ 0x0b: 'EMBEDDED PDV',
  /* 12 */ 0x0c: 'UTF8String',
  /* 13 */ 0x0d: 'RELATIVE-OID',
  /* 14 */ 0x0e: 'TIME',
  /* 16 */ 0x10: 'SEQUENCE', // and SEQUENCE OF
  /* 17 */ 0x11: 'SET', // and SET OF
  /* 18 */ 0x12: 'NumericString',
  /* 19 */ 0x13: 'PrintableString',
  /* 20 */ 0x14: 'TeletexString', // (T61String)
  /* 21 */ 0x15: 'VideotexString',
  /* 22 */ 0x16: 'IA5String',
  /* 23 */ 0x17: 'UTCTime',
  /* 24 */ 0x18: 'GeneralizedTime',
  /* 25 */ 0x19: 'GraphicString',
  /* 26 */ 0x1a: 'VisibleString', // (ISO646String)
  /* 27 */ 0x1b: 'GeneralString',
  /* 28 */ 0x1c: 'UniversalString',
  /* 30 */ 0x1e: 'BMPString',
  /* 31 */ 0x1f: 'DATE',
  /* 32 */ 0x20: 'TIME-OF-DAY',
  /* 33 */ 0x21: 'DATE-TIME',
  /* 34 */ 0x22: 'DURATION',
  /* 35 */ 0x23: 'OID-IRI',
  /* 36 */ 0x24: 'RELATIVE-OID-IRI',

  /* 49 */ 0x30: 'SEQUENCE', // and SEQUENCE OF
  /* 49 */ 0x31: 'SET', // and SET OF
};

module.exports = type;
