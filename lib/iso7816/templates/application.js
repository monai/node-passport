/* eslint-disable no-shadow */
const Type = require('../../asn1/template/type');

module.exports = create;

function create() {
  return new Type(0x61, { ordered: true }, (type) => {
    type.createType(0x4f, { identifier: 'applicationId' });
    type.createType(0x50, { identifier: 'applicationLabel' });
    type.createType(0x51, { identifier: 'fileRef' });
    type.createType(0x52, { identifier: 'commandApdu' });
    type.createType(0x53, { identifier: 'discretionaryData' });
    type.createType(0x73, { identifier: 'discretionaryTemplate' });
    type.createType(0x5f50, { identifier: 'uri' });
    type.createType(0x61, { identifier: 'applicationRelated', ordered: false }, (type) => {
      type.createType(0x79, { identifier: 'tagAllocationScheme' });
    });
  });
}
