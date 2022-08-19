// ISO/IEC 7816-15:2016(E)
// 8.3 CIOChoice type

// PathOrObjects {ObjectType} ::= CHOICE {
//   path    Path,
//   objects [0] SEQUENCE OF ObjectType,
//   ... -- For future extensions
// }

const template = create('ObjectType');

export default template;

export function create(objectType) {
  return {
    0x30: {
      name: 'path',
      description: 'Path',
    },
    0xa0: {
      name: 'objects',
      description: `SEQUENCE OF ${objectType}`,
    },
  };
}
