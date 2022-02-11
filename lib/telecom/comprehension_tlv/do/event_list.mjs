// ETSI TS 102 223 V15.3.0 (2019-07)

// 8.25 Device identities DO'19
const labels = {
  0x00: 'MT call',
  0x01: 'Call connected',
  0x02: 'Call disconnected',
  0x03: 'Location status',
  0x04: 'User activity',
  0x05: 'Idle screen available',
  0x06: 'Card reader status',
  0x07: 'Language selection',
  0x08: 'Browser termination',
  0x09: 'Data available',
  0x0A: 'Channel status',
  0x0B: 'Access Technology Change (single access technology)',
  0x0C: 'Display parameters changed',
  0x0D: 'Local connection',
  0x0E: 'Network Search Mode Change',
  0x0F: 'Browsing status',
  0x10: 'Frames Information Change',
  0x11: 'Reserved for 3GPP (I-WLAN Access Status)',
  0x12: 'Reserved for 3GPP (Network Rejection)',
  0x13: 'HCI connectivity event',
  0x14: 'Access Technology Change (multiple access technologies)',
  0x15: 'Reserved for 3GPP (CSG cell selection)',
  0x16: 'Contactless state request',
  0x17: 'Reserved for 3GPP (IMS Registration)',
  0x18: 'Reserved for 3GPP (IMS Incoming data)',
  0x19: 'Profile Container',
  0x1A: 'Void',
  0x1B: 'Secured Profile Container',
  0x1C: 'Poll Interval Negotiation',
  0x1D: 'Reserved for 3GPP (Data Connection Status Change)',
  0x1E: 'Reserved for 3GPP (for future usage)',
  0x1F: 'Reserved for 3GPP (for future usage)',
  0x20: 'Reserved for 3GPP (for future usage)',
  0x21: 'Reserved for 3GPP (for future usage)',
  0x22: 'Reserved for 3GPP (for future usage)',
};

export function encode() {
  throw new Error('Not implemented');
}

export function decode(data) {
  return [...data.values()].map((value) => ({
    value,
    label: labels[value],
  }));
}
