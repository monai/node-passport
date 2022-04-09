// ETSI TS 101 220 V16.0.0 (2021-04)

import fcpFileOrDataObject from '../../../iso7816/templates/file_control_information/fcp/file_or_data_object.mjs';
import fcpFile from '../../../iso7816/templates/file_control_information/fcp/file.mjs';
import fcpDedicatedFile from '../../../iso7816/templates/file_control_information/fcp/dedicated_file.mjs';
import fcpElementaryFile from '../../../iso7816/templates/file_control_information/fcp/elementary_file.mjs';

import proprietary from './proprietary.mjs';
import pinStatus from './pin_status.mjs';

// 7.2 Assigned TLV tag values
// Table 7.9
const template = {
  0x80: {
    ...fcpElementaryFile[0x80],
    description: 'File Size - Data',
  },
  0x81: {
    ...fcpFileOrDataObject[0x81],
    description: 'File Size - Total',
  },
  0x82: {
    ...fcpFile[0x82],
    description: 'File Descriptor',
  },
  0x83: {
    ...fcpFile[0x83],
    description: 'File Identifier',
  },
  0x84: {
    ...fcpDedicatedFile[0x84],
    description: 'DF Name (AID)',
  },
  0x85: {
    ...fcpFile[0x85],
    description: 'Proprietary - Primitive',
  },
  0x88: {
    ...fcpElementaryFile[0x88],
    description: 'SFI Support',
  },
  0x8A: {
    ...fcpFileOrDataObject[0x8A],
    description: 'Life Cycle Status',
  },
  // Security attribute data object
  0x8B: {
    ...fcpFile[0x8B],
    description: 'Security Attribute - Reference Format',
  },
  0x8C: {
    ...fcpFile[0x8C],
    description: 'Security Attribute - Compact Format',
  },
  0xAB: {
    ...fcpFile[0xAB],
    description: 'Security Attribute Template - Expanded Format',
  },
  // Proprietary template
  0xA5: {
    description: 'Proprietary Template',
    children: proprietary,
  },
  // PIN Status data objects
  0xC6: {
    force: true,
    description: 'PIN Status data objects',
    children: pinStatus,
  },
};

export default template;
