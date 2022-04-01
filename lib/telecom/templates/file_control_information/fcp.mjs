// ETSI TS 101 220 V16.0.0 (2021-04)

import securityAttribute from '../security_attribute_template.mjs';
import proprietary from './proprietary.mjs';
import pinStatus from './pin_status.mjs';

import * as lifeCycleStatus from '../../../iso7816/templates/file_control_information/dos/life_cycle_status.mjs';
import * as fileDescriptor from '../../../iso7816/templates/file_control_information/dos/file_descriptor.mjs';
import * as securityAttributeExpanded from '../../../iso7816/templates/file_control_information/dos/security_attribute_expanded.mjs';
import { decode as inspectInteger } from '../../../iso7816/dos/unsigned_integer.mjs';
import { decode as inspectHexString } from '../../../iso7816/dos/hex_string.mjs';

// 7.2 Assigned TLV tag values
// Table 7.9
const template = {
  0x80: {
    name: 'dataLength',
    description: 'File Size - Data',
    decode: inspectInteger,
  },
  0x81: {
    name: 'totalLength',
    description: 'File Size - Total',
    decode: inspectInteger,
  },
  0x82: {
    name: 'fileDescriptor',
    description: 'File Descriptor',
    ...fileDescriptor,
  },
  0x83: {
    name: 'fileIdentifier',
    description: 'File Identifier',
    inspect: inspectHexString,
  },
  0x84: {
    name: 'dfName',
    description: 'DF Name (AID)',
    inspect: inspectHexString,
  },
  0x85: {
    description: 'Proprietary - Primitive',
  },
  0x88: {
    name: 'shortFileIdentifier',
    description: 'SFI Support',
    inspect: inspectHexString,
  },
  0x8A: {
    name: 'lifeCycleStatus',
    description: 'Life Cycle Status',
    ...lifeCycleStatus,
  },
  // Security attribute data object
  0x8B: {
    name: 'securityAttributeExpanded',
    description: 'Security Attribute - Reference Format',
    ...securityAttributeExpanded,
  },
  0x8C: {
    description: 'Security Attribute - Compact Format',
  },
  0xAB: {
    description: 'Security Attribute Template - Expanded Format',
    children: securityAttribute,
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
