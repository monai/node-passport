// ETSI TS 102 223 V15.3.0 (2019-07)

// 8.7 Device identities DO'02
const labels = {
  0x01: 'Keypad',
  0x02: 'Display',
  0x03: 'Earpiece',
  0x10: 'Additional Card Reader 0',
  0x11: 'Additional Card Reader 1',
  0x12: 'Additional Card Reader 2',
  0x13: 'Additional Card Reader 3',
  0x14: 'Additional Card Reader 4',
  0x15: 'Additional Card Reader 5',
  0x16: 'Additional Card Reader 6',
  0x17: 'Additional Card Reader 7',
  0x21: 'Channel with Channel identifier 1',
  0x22: 'Channel with Channel identifier 2',
  0x23: 'Channel with Channel identifier 3',
  0x24: 'Channel with Channel identifier 4',
  0x25: 'Channel with Channel identifier 5',
  0x26: 'Channel with Channel identifier 6',
  0x27: 'Channel with Channel identifier 7',
  0x31: 'eCAT client identifier 1',
  0x32: 'eCAT client identifier 2',
  0x33: 'eCAT client identifier 3',
  0x34: 'eCAT client identifier 4',
  0x35: 'eCAT client identifier 5',
  0x36: 'eCAT client identifier 6',
  0x37: 'eCAT client identifier 7',
  0x38: 'eCAT client identifier 8',
  0x39: 'eCAT client identifier 9',
  0x3A: 'eCAT client identifier A',
  0x3B: 'eCAT client identifier B',
  0x3C: 'eCAT client identifier C',
  0x3D: 'eCAT client identifier D',
  0x3E: 'eCAT client identifier E',
  0x3F: 'eCAT client identifier F',
  0x81: 'UICC',
  0x82: 'terminal',
  0x83: 'network',
};

const reserved = 'Reserved';

export function encode() {
  throw new Error('Not implemented');
}

export function decode(data) {
  const source = data[0];
  const destination = data[1];

  return {
    source,
    sourceLabel: labels[source] ?? reserved,
    destination,
    destinationLabel: labels[destination] ?? reserved,
  };
}
