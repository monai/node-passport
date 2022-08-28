// ISO/IEC 9594-2:2020 (E)
// InformationFramework

const type = {
  type: 'AttributeTypeAndValue',
  text: 'AttributeTypeAndValue ::= SEQUENCE',
  tag: 0x30,
  children: [
    {
      identifier: 'type',
      text: 'ATTRIBUTE.&id({SupportedAttributes})',
      tag: 0x06,
    },
    {
      identifier: 'value',
      text: 'ATTRIBUTE.&Type({SupportedAttributes}{@type})',
    },
  ],
};

export default type;
