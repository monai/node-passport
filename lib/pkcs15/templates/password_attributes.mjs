// ISO/IEC 7816-15:2016(E)
// 8.9.2 Password attributes; -- A.9.2

const type = {
  type: 'PasswordAttributes',
  text: 'PasswordAttributes ::= SEQUENCE',
  tag: 0x30,
  children: [
    {
      identifier: 'pwdFlags',
      text: 'PasswordFlags',
      tag: 0x03,
    },
    {
      identifier: 'pwdType',
      text: 'PasswordType',
      tag: 0x0a,
    },
    {
      identifier: 'minLength',
      text: 'INTEGER (cia-lb-minPasswordLength..cia-ub-minPasswordLength)',
      tag: 0x02,
    },
    {
      identifier: 'storedLength',
      text: 'INTEGER (0..cia-ub-storedPasswordLength)',
      tag: 0x02,
    },
    {
      identifier: 'maxLength',
      text: 'INTEGER OPTIONAL',
      tag: 0x02,
    },
    {
      identifier: 'pwdReference',
      text: '[0] Reference DEFAULT 0',
      tag: 0x80,
    },
    {
      identifier: 'padChar',
      text: 'OCTET STRING (SIZE (1)) OPTIONAL',
      tag: 0x04,
    },
    {
      identifier: 'lastPasswordChange',
      text: 'GeneralizedTime OPTIONAL',
      tag: 0x18,
    },
    {
      identifier: 'path',
      text: 'Path OPTIONAL',
      tag: 0x30,
    },
    {
      identifier: 'verifDataHistoryLength',
      text: '[1] INTEGER (0..cia-ub-storedVerifDataValueNumber) OPTIONAL',
      tag: 0x81,
    },
    {
      identifier: 'cioSecurityId',
      text: '[2] INTEGER OPTIONAL',
      tag: 0x82,
    },
  ],
};

export default type;
