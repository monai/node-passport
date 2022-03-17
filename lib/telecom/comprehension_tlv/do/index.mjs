// ETSI TS 101 220 V16.0.0 (2021-04)

import * as commandDetails from './command_details.mjs';
import * as deviceIdentities from './device_identities.mjs';
import * as alphaIdentifier from './alpha_identifier.mjs';
import * as address from './address.mjs';
import * as smsTpdu from './sms_tpdu.mjs';
import * as textString from './text_string.mjs';
import * as item from './item.mjs';
import * as itemIdentifier from './item_identifier.mjs';
import * as eventList from './event_list.mjs';

// Table 7.23
export default {
  0x01: commandDetails,
  0x02: deviceIdentities,
  0x05: alphaIdentifier,
  0x06: address,
  0x0b: smsTpdu,
  0x0d: textString,
  0x0f: item,
  0x10: itemIdentifier,
  0x19: eventList,
};
