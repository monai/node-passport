// ISO/IEC 9594-2:2020 (E)
// InformationFramework

import relativeDistinguishedName from './relative_distinguished_name.mjs';

const type = {
  type: 'RDNSequence',
  text: 'RDNSequence ::= SEQUENCE OF RelativeDistinguishedName',
  tag: 0x30,
  children: [
    relativeDistinguishedName,
  ],
};

export default type;
