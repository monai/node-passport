// ISO/IEC 7816-15:2016(E)
// 8.9.2 Password attributes; -- A.9.2

const template = {
  0x30: {
    name: 'PasswordAttributes',
    children: {
      0x03: {
        name: 'pwdFlags',
      },
      0x0a: {
        name: 'pwdType',
      },
      0x02: (node) => {
        const index = node.parent.children.indexOf(node);

        if (index === 2) {
          return {
            name: 'minLength',
          };
        }

        if (index === 3) {
          return {
            name: 'storedLength',
          };
        }

        if (index === 4) {
          return {
            name: 'maxLength',
          };
        }

        return undefined;
      },
      0x80: {
        name: 'pwdReference',
      },
      0x04: {
        name: 'padChar',
      },
      0x18: {
        name: 'lastPasswordChange',
      },
      0x30: {
        name: 'path',
      },
      0xa1: {
        name: 'verifDataHistoryLength',
      },
      0xa2: {
        name: 'cioSecurityId',
      },
    },
  },
};

export default template;
