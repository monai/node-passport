// Doc 9309-11:2015 9.2 Information on Supported Protocols

import paceInfo from './pace_info.mjs';

// SecurityInfos ::= SET OF SecurityInfo
//   SecurityInfo ::= SEQUENCE {
//     protocol OBJECT IDENTIFIER,
//     requiredData ANY DEFINED BY protocol,
//     optionalData ANY DEFINED BY protocol OPTIONAL
//   }
// }

// To indicate support for PACE SecurityInfos may contain the following entries:
//   - At least one PACEInfo using a standardized domain parameter MUST be present.
//   - For each supported set of explicit domain parameters a PACEDomainParameterInfo MUST be
//     present.

const template = {
  0x31: {
    description: 'SET OF SecurityInfo',
    children: paceInfo,
  },
};

export default template;
