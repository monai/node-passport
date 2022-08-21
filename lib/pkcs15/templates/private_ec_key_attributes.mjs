// ISO/IEC 7816-15:2016(E)
// -- A.4.3

const template = {
  0x30: {
    name: 'privateECKeyAttributes',
    description: 'PrivateECKeyAttributes',
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
