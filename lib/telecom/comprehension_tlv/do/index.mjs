import * as commandDetails from './command_details.mjs';
import * as deviceIdentities from './device_identities.mjs';
import * as alphaIdentifier from './alpha_identifier.mjs';
import * as address from './address.mjs';
import * as smsTpdu from './sms_tpdu.mjs';
import * as textString from './text_string.mjs';
import * as item from './item.mjs';
import * as itemIdentifier from './item_identifier.mjs';
import * as eventList from './event_list.mjs';

export default {
  0x01: commandDetails,
  0x81: commandDetails,
  0x02: deviceIdentities,
  0x82: deviceIdentities,
  0x05: alphaIdentifier,
  0x85: alphaIdentifier,
  0x06: address,
  0x86: address,
  0x0b: smsTpdu,
  0x8b: smsTpdu,
  0x0d: textString,
  0x8d: textString,
  0x0f: item,
  0x8f: item,
  0x10: itemIdentifier,
  0x90: itemIdentifier,
  0x19: eventList,
  0x99: eventList,
};
