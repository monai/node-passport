/* eslint-disable no-shadow */
const Type = require('../../asn1/template/type');

module.exports = create;

function create() {
  return new Type(0x62, { ordered: true }, (type) => {
    type.createType(0x80, { identifier: 'fileLength' });
    type.createType(0x82, { identifier: 'fileDescriptor' });
    type.createType(0x83, { identifier: 'fileId' });
    type.createType(0x88, { identifier: 'shortFileId' });
    type.createType(0x8a, { identifier: 'lifeCycleStatus' });
    type.createType(0xa1, { identifier: 'securityAttributeProprietary', ordered: true }, (type) => {
      type.createType(0x8c, { identifier: 'securityAttributeCompact' });
    });
  });
}
