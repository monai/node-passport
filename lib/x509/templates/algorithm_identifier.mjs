// ISO/IEC 9594-8:2017 (E)
// 6.2.2 Formal definitions of cryptographic algorithms

const template = {
  0x30: {
    description: 'AlgorithmIdentifier',
    children: {
      0x06: (node) => {
        const index = node.parent.children.indexOf(node);

        if (index === 0) {
          return {
            name: 'algorithm',
          };
        }

        if (index === 1) {
          return {
            name: 'parameters',
          };
        }

        return undefined;
      },
    },
  },
};

export default template;
