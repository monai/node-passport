// ISO/IEC 9594-2:2020 (E)
// InformationFramework

import attributeTypeAndValue from './attribute_type_and_value.mjs';

const type = {
  type: 'RelativeDistinguishedName',
  text: 'RelativeDistinguishedName ::= SET SIZE (1..MAX) OF AttributeTypeAndValue',
  tag: 0x31,
  children: [
    attributeTypeAndValue,
  ],
};

export default type;
