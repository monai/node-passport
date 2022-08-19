// ISO/IEC 7816-15:2016(E)
// 8.10 Cryptographic information file, EF.CIAInfo

// CIAInfo ::= SEQUENCE {
//   version             INTEGER {v1(0),v2(1)} (v1|v2,...),
//   serialNumber        OCTET STRING OPTIONAL,
//   manufacturerID      Label OPTIONAL,
//   label               [0] Label OPTIONAL,
//   cardflags           CardFlags,
//   seInfo              SEQUENCE OF SecurityEnvironmentInfo OPTIONAL,
//   recordInfo          [1] RecordInfo OPTIONAL,
//   supportedAlgorithms [2] SEQUENCE OF AlgorithmInfo OPTIONAL,
//   issuerId            [3] Label OPTIONAL,
//   holderId            [4] Label OPTIONAL,
//   lastUpdate          [5] LastUpdate OPTIONAL,
//   preferredLanguage   PrintableString OPTIONAL, -- In accordance with IETF RFC 5646
//   profileIndication   [6] SEQUENCE OF ProfileIndication OPTIONAL,
//   ... -- For future extensions
// } (CONSTRAINED BY { -- Each AlgorithmInfo.reference value shall be unique --})

// CardFlags ::= BIT STRING {
//   readonly      (0),
//   authRequired  (1),
//   prnGeneration (2)
// } -- Bit (3) is reserved for historical reasons

// SecurityEnvironmentInfo ::= SEQUENCE {
//   se    INTEGER,
//   owner OBJECT IDENTIFIER OPTIONAL,
//   aid   OCTET STRING
//   (CONSTRAINED BY {-- Must be encoded in accordance with ISO/IEC 7816-4 --}) OPTIONAL,
//   ... -- For future extensions
// }

// RecordInfo ::= SEQUENCE {
//   oDRecordLength    [0] INTEGER (0..cia-ub-recordLength) OPTIONAL,
//   prKDRecordLength  [1] INTEGER (0..cia-ub-recordLength) OPTIONAL,
//   puKDRecordLength  [2] INTEGER (0..cia-ub-recordLength) OPTIONAL,
//   sKDRecordLength   [3] INTEGER (0..cia-ub-recordLength) OPTIONAL,
//   cDRecordLength    [4] INTEGER (0..cia-ub-recordLength) OPTIONAL,
//   dCODRecordLength  [5] INTEGER (0..cia-ub-recordLength) OPTIONAL,
//   aODRecordLength   [6] INTEGER (0..cia-ub-recordLength) OPTIONAL
// }

// AlgorithmInfo ::= SEQUENCE {
//   reference           Reference,
//   algorithm           CIO-ALGORITHM.&id({AlgorithmSet}),
//   parameters          CIO-ALGORITHM.&Parameters({AlgorithmSet}{@algorithm}),
//   supportedOperations CIO-ALGORITHM.&Operations({AlgorithmSet}{@algorithm}),
//   objId               CIO-ALGORITHM.&objectIdentifier ({AlgorithmSet}{@algorithm}),
//   algRef              Reference OPTIONAL
// }

// LastUpdate ::= CHOICE {
//   generalizedTime GeneralizedTime,
//   referencedTime  ReferencedValue,
//   ... -- For future extensions
// }(CONSTRAINED BY {-- The referencedValue shall be of type GeneralizedTime --})

// ProfileIndication ::= CHOICE {
//   profileOID  OBJECT IDENTIFIER,
//   profileName UTF8String,
//   ... -- For future extensions
// }

const template = {
  0x02: {
    name: 'version',
    description: 'Version',
  },
  0x04: {
    name: 'serialNumber',
    description: 'Serial number',
  },
  0x0c: {
    name: 'manufacturerId',
    description: 'Manufacturer ID',
  },
  0x80: {
    name: 'label',
    description: 'Application identifier',
  },
  0x03: {
    name: 'cardFlags',
    description: 'Card flags',
  },
  0x30: {
    name: 'seInfo',
    description: 'Security environments',
  },
  0xa1: {
    name: 'recordInfo',
    description: 'Record info',
  },
  0xa2: {
    name: 'supportedAlgorithms',
    description: 'SEQUENCE OF AlgorithmInfo',
  },
  0xa3: {
    name: 'issuerId',
    description: 'Issuer identifier',
  },
  0xa4: {
    name: 'holderId',
    description: 'Holder identifier',
  },
  0x00: {
    name: 'lastUpdate',
    description: 'Last update',
  },
  0x13: {
    name: 'preferredLanguage',
    description: 'Preferred language',
  },
  0xa6: {
    name: 'profileIndication',
    description: 'SEQUENCE OF ProfileIndication',
  },
};

export default template;
