/* eslint-disable no-shadow */
const Type = require('../../asn1/template/type');

module.exports = create;

function create() {
  return new Type({ tagIdentifier: 0x62, ordered: true }, (type) => {
    type.createType({ tagIdentifier: 0x80, identifier: 'fileLength' });
    type.createType({ tagIdentifier: 0x82, identifier: 'fileDescriptor' });
    type.createType({ tagIdentifier: 0x83, identifier: 'fileId' });
    type.createType({ tagIdentifier: 0x88, identifier: 'shortFileId' });
    type.createType({ tagIdentifier: 0x8a, identifier: 'lifeCycleStatus' });
    type.createType({ tagIdentifier: 0xa1, identifier: 'securityAttributeProprietary', ordered: true }, (type) => {
      type.createType({ tagIdentifier: 0x8c, identifier: 'securityAttributeCompact' });
    });
  });
}
