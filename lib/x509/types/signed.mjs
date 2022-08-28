// ISO/IEC 9594-8:2020 (E)
// 7.2.1 Public-key certificate syntax

import algorithmIdentifier from './algorithm_identifier.mjs';

const type = {
  type: 'SIGNED {ToBeSigned}',
  text: 'SIGNED {ToBeSigned} ::= SEQUENCE',
  tag: 0x30,
  children: [
    {
      identifier: 'toBeSigned',
      text: 'ToBeSigned',
      tag: 0x30,
    },
    {
      identifier: 'algorithmIdentifier',
      text: 'AlgorithmIdentifier {{SupportedAlgorithms}}',
      tag: 0x30,
      children: algorithmIdentifier.children,
    },
    {
      identifier: 'signature',
      text: 'BIT STRING',
      tag: 0x03,
    },
    {
      identifier: 'altAlgorithmIdentifier',
      text: 'AlgorithmIdentifier {{SupportedAltAlgorithms}} OPTIONAL',
      tag: 0x30,
      children: algorithmIdentifier.children,
    },
    {
      identifier: 'altSignature',
      text: 'BIT STRING OPTIONAL',
      tag: 0x03,
    },
  ],
};

export default type;

export function create(options) {
  return {
    ...type,
    children: [
      options.toBeSigned,
      ...type.children.slice(1),
    ],
  };
}
