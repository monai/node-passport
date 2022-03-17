// ETSI TS 102 223 V15.3.0 (2019-07)
// 8.6 Command details

const labels = {
  0x00: 'Location Information according to current NAA',
  0x01: 'IMEI of the terminal',
  0x02: 'Network Measurement results according to current NAA',
  0x03: 'Date, time and time zone',
  0x04: 'Language setting',
  0x05: 'Reserved for GSM',
  0x06: 'Access Technology(single access technology)',
  0x07: 'ESN of the terminal',
  0x08: 'IMEISV of the terminal',
  0x09: 'Search Mode',
  0x0A: 'Charge State of the Battery(if class "g" is supported)',
  0x0B: 'MEID of the terminal',
  0x0C: 'reserved for 3GPP(current WSID)',
  0x0D: 'Broadcast Network information according to current Broadcast Network Technology used',
  0x0E: 'Multiple Access Technologies',
  0x0F: 'Location Information for multiple access technologies',
  0x10: 'Network Measurement results for multiple access technologies',
  0x11: 'reserved for 3GPP(CSG ID list and corresponding HNB name)',
  0x12: 'reserved for 3GPP(H(e)NB IP address)',
  0x13: 'reserved for 3GPP(H(e)NB surrounding macrocells)',
  0x14: 'reserved for 3GPP(current WLAN identifier)',
  0x15: 'reserved for 3GPP(for future usage)',
  0x16: 'reserved for 3GPP(for future usage)',
  0x17: 'reserved for 3GPP(for future usage)',
  0x18: 'reserved for 3GPP(for future usage)',
  0x19: 'reserved for 3GPP(for future usage)',
  0x1A: 'Supported Radio Access Technologies',
};

const defaultLabel = 'Reserved';

export const inspect = decode;

export function encode() {
  throw new Error('Not implemented');
}

export function decode(data) {
  const label = labels[data] ?? defaultLabel;

  return {
    data,
    label,
  };
}
