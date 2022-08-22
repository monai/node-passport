// ISO/IEC 7816-15:2016(E)
// 8.5.3 Public elliptic curve key attributes; -- A.5.3

const template = {
  0x30: {
    name: 'publicECKeyAttributes',
    description: 'PublicECKeyAttributes',
    children: {
      0x30: (node) => {
        const index = node.parent.children.indexOf(node);

        if (index === 0) {
          return {
            name: 'value',
          };
        }

        if (index === 1) {
          return {
            name: 'keyInfo',
          };
        }

        return undefined;
      },
    },
  },
};

export default template;
