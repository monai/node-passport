// ETSI TS 101 220 V16.0.0 (2021-04)

import securityAttribute from './security_attribute_template.mjs';
import proprietary from './proprietary_template.mjs';
import pinStatus from './pin_status_dos.mjs';

import { decode as decodeLifeCycleStatus } from '../../iso7816/dos/fcp/life_cycle_status.mjs';
import { decode as decodeFileDescriptor } from '../../iso7816/dos/fcp/file_descriptor.mjs';
import {
  decode as decodeSecurityAttributeExpanded,
  inspect as inspectSecurityAttributeExpanded,
} from '../../iso7816/dos/fcp/security_attribute_expanded.mjs';
import { decode as inspectInteger } from '../../iso7816/dos/unsigned_integer.mjs';
import { decode as inspectHexString } from '../../iso7816/dos/hex_string.mjs';

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
    decode: decodeFileDescriptor,
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
    decode: decodeLifeCycleStatus,
  },
  // Security attribute data object
  0x8B: {
    name: 'securityAttributeExpanded',
    description: 'Security Attribute - Reference Format',
    decode: decodeSecurityAttributeExpanded,
    inspect: inspectSecurityAttributeExpanded,
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
    description: 'PIN Status data objects',
    children: pinStatus,
  },
};

export default template;
