// // ISO/IEC 9594-8:2020 (E)
// 6.2.2 Formal definitions of cryptographic algorithms

const type = {
  type: 'AlgorithmIdentifier',
  text: 'AlgorithmIdentifier{ALGORITHM:SupportedAlgorithms} ::= SEQUENCE',
  tag: 0x30,
  children: [
    {
      identifier: 'algorithm',
      text: 'ALGORITHM.&id({SupportedAlgorithms})',
      tag: 0x06,
    },
    {
      identifier: 'parameters',
      text: 'ALGORITHM.&Type({SupportedAlgorithms}{@algorithm}) OPTIONAL',
      tag: 0x06,
    },
  ],
};

export default type;
