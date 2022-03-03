// ETSI TS 123 040 V16.0.0 (2020-07)
// 9.2.3.9 TP-Protocol-Identifier (TP-PID)

export const noInterworking = 'noInterworking';
export const telematicInterworking = 'telematicInterworking';

const telematicDevices = {
  0b00000: 'implicit - device type is specific to this SC, or can be concluded on the basis of the address',
  0b00001: 'telex (or teletex reduced to telex format)',
  0b00010: 'group 3 telefax',
  0b00011: 'group 4 telefax',
  0b00100: 'voice telephone (i.e. conversion to speech)',
  0b00101: 'ERMES (European Radio Messaging System)',
  0b00110: 'National Paging system (known to the SC)',
  0b00111: 'Videotex (T.100/T.101)',
  0b01000: 'teletex, carrier unspecified',
  0b01001: 'teletex, in PSPDN',
  0b01010: 'teletex, in CSPDN',
  0b01011: 'teletex, in analog PSTN',
  0b01100: 'teletex, in digital ISDN',
  0b01101: 'UCI (Universal Computer Interface, ETSI DE/PS 3 01-3)',
  0b01110: 'reserved',
  0b01111: 'reserved',
  0b10000: 'a message handling facility (known to the SC)',
  0b10001: 'any public X.400-based message handling system',
  0b10010: 'Internet Electronic Mail',
  0b10011: 'reserved',
  0b10100: 'reserved',
  0b10101: 'reserved',
  0b10110: 'reserved',
  0b10111: 'reserved',
  0b11000: 'values specific to each SC, usage based on mutual agreement between the SME and the SC',
  0b11001: 'values specific to each SC, usage based on mutual agreement between the SME and the SC',
  0b11010: 'values specific to each SC, usage based on mutual agreement between the SME and the SC',
  0b11011: 'values specific to each SC, usage based on mutual agreement between the SME and the SC',
  0b11100: 'values specific to each SC, usage based on mutual agreement between the SME and the SC',
  0b11101: 'values specific to each SC, usage based on mutual agreement between the SME and the SC',
  0b11110: 'values specific to each SC, usage based on mutual agreement between the SME and the SC',
  0b11111: 'A GSM/UMTS mobile station',
};

const protocolTypes = {
  0b000000: 'Short Message Type 0',
  0b000001: 'Replace Short Message Type 1',
  0b000010: 'Replace Short Message Type 2',
  0b000011: 'Replace Short Message Type 3',
  0b000100: 'Replace Short Message Type 4',
  0b000101: 'Replace Short Message Type 5',
  0b000110: 'Replace Short Message Type 6',
  0b000111: 'Replace Short Message Type 7',
  0b001000: 'Device Triggering Short Message',
  0b001001: 'Reserved',
  0b011010: 'Reserved',
  0b011011: 'Reserved',
  0b011100: 'Reserved',
  0b011101: 'Reserved',
  0b011110: 'Enhanced Message Service (Obsolete)',
  0b011111: 'Return Call Message',
  0b100000: 'Reserved',
  0b111001: 'Reserved',
  0b111010: 'Reserved',
  0b111011: 'Reserved',
  0b111100: 'ANSI-136 R-DATA',
  0b111101: 'ME Data download',
  0b111110: 'ME De-personalization Short Message',
  0b111111: '(U)SIM Data download',
};

export const inspect = decode;

export function encode() {
  throw new Error('Not implemented');
}

export function decode(data) {
  const out = {};

  const b7b6 = (data >> 6) & 0b11;
  const b5 = (data >> 5) & 0b1;
  const b4b0 = data & 0x1f;
  const b5b0 = data & 0x3f;

  if (b7b6 === 0b00) {
    if (b5 === 0) {
      out.interworking = noInterworking;
      out.smeToSmeProtocol = true;
    } else {
      out.interworking = telematicInterworking;
      out.telematicDevice = telematicDevices[b4b0];
    }
  } else if (b7b6 === 0b01) {
    out.protocol = protocolTypes[b5b0];
  }

  return out;
}
