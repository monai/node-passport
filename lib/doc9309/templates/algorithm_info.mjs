// ISO/IEC 7816-15:2016(E)
// 8.10 Cryptographic information file, EF.CIAInfo

// IMPORTS
// Parameters FROM ANSI-X9-62 {iso(1) member-body(2) us(840) ansi-x962(10045) module(5) 1}

// AlgorithmInfo ::= SEQUENCE {
//   reference           Reference,
//   algorithm           CIO-ALGORITHM.&id({AlgorithmSet}),
//   parameters          CIO-ALGORITHM.&Parameters({AlgorithmSet}{@algorithm}),
//   supportedOperations CIO-ALGORITHM.&Operations({AlgorithmSet}{@algorithm}),
//   objId               CIO-ALGORITHM.&objectIdentifier ({AlgorithmSet}{@algorithm}),
//   algRef              Reference OPTIONAL
// }

// CIO-ALGORITHM ::= CLASS {
//   &id               INTEGER UNIQUE,
//   &Parameters,
//   &Operations       Operations,
//   &objectIdentifier OBJECT IDENTIFIER OPTIONAL
// } WITH SYNTAX {
//   PARAMETERS &Parameters
//   OPERATIONS &Operations
//   ID &id
//   [OID &objectIdentifier]
// }

// Operations ::= BIT STRING {
//   compute-checksum  (0), -- H/W computation of checksum
//   compute-signature (1), -- H/W computation of signature
//   verify-checksum   (2), -- H/W verification of checksum
//   verify-signature  (3), -- H/W verification of signature
//   encipher          (4), -- H/W encryption of data
//   decipher          (5), -- H/W decryption of data
//   hash              (6), -- H/W hashing
//   generate-key      (7), -- H/W key generation
//   derive-key        (8)  -- H/W key derivation
// }

// cia-alg-null CIO-ALGORITHM ::= {
//   PARAMETERS NULL OPERATIONS {{generate-key}} ID -1
// }

// AlgorithmSet CIO-ALGORITHM ::= {
//   cia-alg-null,
//   ... -- See PKCS #11 for possible values for the &id component (and parameters)
// }

// 30 UC l:26 SEQUENCE
//   02 UP l:1 INTEGER :: <Buffer 01> 1n
//   02 UP l:1 INTEGER :: <Buffer 03> 3n
//   05 UP l:0 NULL :: undefined
//   03 UP l:2 BIT STRING :: <Buffer 06 40> '01'
//   06 UP l:9 OBJECT :: <Buffer 2a 86 48 86 f7 0d 01 01 01> '1.2.840.113549.1.1.1'
//   02 UP l:1 INTEGER :: <Buffer 0f> 15n

const dataValues = [
  {
    name: 'reference',
    description: 'Reference',
  },
  {
    name: 'algorithm',
    description: 'Algorithm',
  },
  undefined,
  undefined,
  undefined,
  {
    name: 'algRef',
    description: 'Algorithm reference',
  },
];

const template = {
  0x30: {
    description: 'AlgorithmInfo',
    children: {
      0x02: (node) => {
        const index = node.parent.children.indexOf(node);
        return dataValues[index];
      },
      0x03: {
        name: 'supportedOperations',
        description: 'Supported operations',
      },
      0x05: (node) => {
        const index = node.parent.children.indexOf(node);
        if (index === 2) {
          return {
            name: 'parameters',
            description: 'Parameters',
          };
        }

        return undefined;
      },
      0x06: {
        name: 'objId',
        description: 'Object identifier',
      },
    },
  },
};

export default template;
