// ISO/IEC 9594-2:2020 (E)
// InformationFramework

import rdnSequence from './rdn_sequence.mjs';

const type = {
  type: 'Name',
  text: 'Name ::= CHOICE { -- only one possibility for now -- rdnSequence RDNSequence }',
  singleComponentType: true,
  children: rdnSequence.children,
};

export default type;
