// ISO/IEC 7816-15:2016(E)
// 8.7.2 X.509 certificate attributes; -- A.7.2

const template = {
  0x30: {
    name: 'x509Attributes',
    description: 'x509Attributes',
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
            name: 'subject',
          };
        }

        return undefined;
      },
      0xa0: {
        name: 'issuer',
      },
      0x02: {
        name: 'serialNumber',
      },
    },
  },
};

export default template;
