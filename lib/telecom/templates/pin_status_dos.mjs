// ETSI TS 101 220 V16.0.0 (2021-04)

import { decode as decodePsDo } from '../dos/pin_status/ps_do.mjs';
import { decode as unsignedInteger } from '../../iso7816/dos/unsigned_integer.mjs';
import { decode as hexString } from '../../iso7816/dos/hex_string.mjs';

// 7.2 Assigned TLV tag values
// Table 7.12
const dos = {
  0x83: {
    description: 'Key Reference',
    decode: unsignedInteger,
  },
  0x90: {
    description: 'PIN Enabled/Disabled status byte(s)',
    decode: decodePsDo,
  },
  0x95: {
    description: 'Usage Qualifier',
    inspect: hexString,
  },
};

export default dos;
