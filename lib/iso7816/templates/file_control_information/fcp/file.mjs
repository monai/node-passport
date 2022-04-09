// BS ISO/IEC 7816-4:2013

import * as fileDescriptor from '../dos/file_descriptor.mjs';
import * as accessRuleReferences from '../dos/access_rule_references.mjs';
import securityAttribute from '../../security_attributes/expanded.mjs';
import { decode as inspectHexString } from '../../../dos/hex_string.mjs';
import fileOrDataObject from './file_or_data_object.mjs';

// Table 10 — Control parameter data objects
const own = {
  0x82: {
    name: 'fileDescriptor',
    description: 'File descriptor',
    ...fileDescriptor,
  },
  0x83: {
    name: 'fileIdentifier',
    description: 'File identifier',
    inspect: inspectHexString,
  },
  0x85: {
    description: 'Proprietary information',
  },
  0x86: {
    description: 'Security attributes in proprietary format',
  },
  0x8b: {
    name: 'securityAttributeReference',
    description: 'Security attribute referencing the expanded format',
    ...accessRuleReferences,
  },
  0x8c: {
    description: 'Security attribute in compact format, SE oriented',
  },
  0xa1: {
    description: 'Security attribute template in proprietary format',
  },
  0xa5: {
    description: 'Proprietary information encoded in BER-TLV',
  },
  0xab: {
    description: 'Security attribute template in expanded format',
    children: securityAttribute,
  },
};

export default {
  ...fileOrDataObject,
  ...own,
};

export const dos = Object.keys(own);
