// ISO/IEC 7816-15:2016(E)
// 8.2.9 CommonKeyAttributes; -- A.2.9

const template = {
  0x04: {
    name: 'iD',
  },
  0x03: (node) => {
    const index = node.parent.children.indexOf(node);
    if (index === 1) {
      return {
        name: 'usage',
      };
    }

    if (index === 2 || index === 3) {
      return {
        name: 'accessFlags',
      };
    }

    return undefined;
  },
  0x01: {
    name: 'native',
  },
  0x02: {
    name: 'keyReference',
  },
  0x18: {
    name: 'startDate',
  },
  0xa0: {
    name: 'endDate',
  },
  0xa1: {
    name: 'algReference',
    description: 'SEQUENCE OF Reference',
  },
};

export default template;
