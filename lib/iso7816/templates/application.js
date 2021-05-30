/* eslint-disable no-shadow */
const Type = require('../../asn1/template/type');

module.exports = create;

function create() {
  return new Type({ tag: 0x61, ordered: true }, (type) => {
    type.createType({ tag: 0x4f, identifier: 'applicationId' });
    type.createType({ tag: 0x50, identifier: 'applicationLabel' });
    type.createType({ tag: 0x51, identifier: 'fileRef' });
    type.createType({ tag: 0x52, identifier: 'commandApdu' });
    type.createType({ tag: 0x53, identifier: 'discretionaryData' });
    type.createType({ tag: 0x73, identifier: 'discretionaryTemplate' });
    type.createType({ tag: 0x5f50, identifier: 'uri' });
    type.createType({ tag: 0x61, identifier: 'applicationRelated', ordered: false }, (type) => {
      type.createType({ tag: 0x79, identifier: 'tagAllocationScheme' });
    });
  });
}
