// ETSI TS 102 223 V15.3.0 (2019-07)

// 9.4 Type of command and next action indicator
const template = {
  0x01: {
    description: 'REFRESH',
    typeOfCommandCoding: true,
    nextActionIndicatorCoding: false,
  },
  0x02: {
    description: 'MORE TIME',
    typeOfCommandCoding: true,
    nextActionIndicatorCoding: false,
  },
  0x03: {
    description: 'POLL INTERVAL',
    typeOfCommandCoding: true,
    nextActionIndicatorCoding: false,
  },
  0x04: {
    description: 'POLLING OFF',
    typeOfCommandCoding: true,
    nextActionIndicatorCoding: false,
  },
  0x05: {
    description: 'SET UP EVENT LIST',
    typeOfCommandCoding: true,
    nextActionIndicatorCoding: false,
  },
  0x10: {
    description: 'SET UP CALL',
    typeOfCommandCoding: true,
    nextActionIndicatorCoding: true,
  },
  0x11: {
    description: 'Reserved for GSM/3G (SEND SS)',
    typeOfCommandCoding: true,
    nextActionIndicatorCoding: true,
  },
  0x12: {
    description: 'Reserved for GSM/3G (SEND USSD)',
    typeOfCommandCoding: true,
    nextActionIndicatorCoding: true,
  },
  0x13: {
    description: 'SEND SHORT MESSAGE',
    typeOfCommandCoding: true,
    nextActionIndicatorCoding: true,
  },
  0x14: {
    description: 'SEND DTMF',
    typeOfCommandCoding: true,
    nextActionIndicatorCoding: true,
  },
  0x15: {
    description: 'LAUNCH BROWSER',
    typeOfCommandCoding: true,
    nextActionIndicatorCoding: true,
  },
  0x16: {
    description: 'Reserved for 3GPP (GEOGRAPHICAL LOCATION REQUEST)',
    typeOfCommandCoding: true,
    nextActionIndicatorCoding: false,
  },
  0x20: {
    description: 'PLAY TONE',
    typeOfCommandCoding: true,
    nextActionIndicatorCoding: true,
  },
  0x21: {
    description: 'DISPLAY TEXT',
    typeOfCommandCoding: true,
    nextActionIndicatorCoding: true,
  },
  0x22: {
    description: 'GET INKEY',
    typeOfCommandCoding: true,
    nextActionIndicatorCoding: true,
  },
  0x23: {
    description: 'GET INPUT',
    typeOfCommandCoding: true,
    nextActionIndicatorCoding: true,
  },
  0x24: {
    description: 'SELECT ITEM',
    typeOfCommandCoding: true,
    nextActionIndicatorCoding: true,
  },
  0x25: {
    description: 'SET UP MENU',
    typeOfCommandCoding: true,
    nextActionIndicatorCoding: true,
  },
  0x26: {
    description: 'PROVIDE LOCAL INFORMATION',
    typeOfCommandCoding: true,
    nextActionIndicatorCoding: false,
  },
  0x27: {
    description: 'TIMER MANAGEMENT',
    typeOfCommandCoding: true,
    nextActionIndicatorCoding: false,
  },
  0x28: {
    description: 'SET UP IDLE MODE TEXT',
    typeOfCommandCoding: true,
    nextActionIndicatorCoding: true,
  },
  0x30: {
    description: 'PERFORM CARD APDU',
    typeOfCommandCoding: true,
    nextActionIndicatorCoding: true,
  },
  0x31: {
    description: 'POWER ON CARD',
    typeOfCommandCoding: true,
    nextActionIndicatorCoding: true,
  },
  0x32: {
    description: 'POWER OFF CARD',
    typeOfCommandCoding: true,
    nextActionIndicatorCoding: true,
  },
  0x33: {
    description: 'GET READER STATUS',
    typeOfCommandCoding: true,
    nextActionIndicatorCoding: true,
  },
  0x34: {
    description: 'RUN AT COMMAND',
    typeOfCommandCoding: true,
    nextActionIndicatorCoding: false,
  },
  0x35: {
    description: 'LANGUAGE NOTIFICATION',
    typeOfCommandCoding: true,
    nextActionIndicatorCoding: false,
  },
  0x40: {
    description: 'OPEN CHANNEL',
    typeOfCommandCoding: true,
    nextActionIndicatorCoding: true,
  },
  0x41: {
    description: 'CLOSE CHANNEL',
    typeOfCommandCoding: true,
    nextActionIndicatorCoding: true,
  },
  0x42: {
    description: 'RECEIVE DATA',
    typeOfCommandCoding: true,
    nextActionIndicatorCoding: true,
  },
  0x43: {
    description: 'SEND DATA',
    typeOfCommandCoding: true,
    nextActionIndicatorCoding: true,
  },
  0x44: {
    description: 'GET CHANNEL STATUS',
    typeOfCommandCoding: true,
    nextActionIndicatorCoding: true,
  },
  0x45: {
    description: 'SERVICE SEARCH',
    typeOfCommandCoding: true,
    nextActionIndicatorCoding: true,
  },
  0x46: {
    description: 'GET SERVICE INFORMATION',
    typeOfCommandCoding: true,
    nextActionIndicatorCoding: true,
  },
  0x47: {
    description: 'DECLARE SERVICE',
    typeOfCommandCoding: true,
    nextActionIndicatorCoding: false,
  },
  0x50: {
    description: 'SET FRAMES',
    typeOfCommandCoding: true,
    nextActionIndicatorCoding: false,
  },
  0x51: {
    description: 'GET FRAMES STATUS',
    typeOfCommandCoding: true,
    nextActionIndicatorCoding: false,
  },
  0x60: {
    description: '(RETRIEVE MULTIMEDIA MESSAGE)',
    typeOfCommandCoding: true,
    nextActionIndicatorCoding: true,
  },
  0x61: {
    description: '(SUBMIT MULTIMEDIA MESSAGE)',
    typeOfCommandCoding: true,
    nextActionIndicatorCoding: true,
  },
  0x62: {
    description: 'DISPLAY MULTIMEDIA MESSAGE',
    typeOfCommandCoding: true,
    nextActionIndicatorCoding: true,
  },
  0x70: {
    description: 'ACTIVATE',
    typeOfCommandCoding: true,
    nextActionIndicatorCoding: false,
  },
  0x71: {
    description: 'CONTACTLESS STATE CHANGED',
    typeOfCommandCoding: true,
    nextActionIndicatorCoding: false,
  },
  0x72: {
    description: 'COMMAND CONTAINER',
    typeOfCommandCoding: true,
    nextActionIndicatorCoding: false,
  },
  0x73: {
    description: 'ENCAPSULATED SESSION CONTROL',
    typeOfCommandCoding: true,
    nextActionIndicatorCoding: false,
  },
  0x74: {
    description: 'Void',
    typeOfCommandCoding: false,
    nextActionIndicatorCoding: false,
  },
  0x75: {
    description: 'Reserved for 3GPP (for future usage) not available not available',
    typeOfCommandCoding: 'notAvailable',
    nextActionIndicatorCoding: 'notAvailable',
  },
  0x76: {
    description: 'Reserved for 3GPP (for future usage) not available not available',
    typeOfCommandCoding: 'notAvailable',
    nextActionIndicatorCoding: 'notAvailable',
  },
  0x77: {
    description: 'Reserved for 3GPP (for future usage) not available not available',
    typeOfCommandCoding: 'notAvailable',
    nextActionIndicatorCoding: 'notAvailable',
  },
  0x78: {
    description: 'Reserved for 3GPP (for future usage) not available not available',
    typeOfCommandCoding: 'notAvailable',
    nextActionIndicatorCoding: 'notAvailable',
  },
  0x81: {
    description: 'End of the proactive UICC session not applicable',
    typeOfCommandCoding: 'notApplicable',
    nextActionIndicatorCoding: true,
  },
  0xF0: {
    description: 'Reserved for proprietary use',
    typeOfCommandCoding: true,
    nextActionIndicatorCoding: true,
  },
  0xF1: {
    description: 'Reserved for proprietary use',
    typeOfCommandCoding: true,
    nextActionIndicatorCoding: true,
  },
  0xF2: {
    description: 'Reserved for proprietary use',
    typeOfCommandCoding: true,
    nextActionIndicatorCoding: true,
  },
  0xF3: {
    description: 'Reserved for proprietary use',
    typeOfCommandCoding: true,
    nextActionIndicatorCoding: true,
  },
  0xF4: {
    description: 'Reserved for proprietary use',
    typeOfCommandCoding: true,
    nextActionIndicatorCoding: true,
  },
  0xF5: {
    description: 'Reserved for proprietary use',
    typeOfCommandCoding: true,
    nextActionIndicatorCoding: true,
  },
  0xF6: {
    description: 'Reserved for proprietary use',
    typeOfCommandCoding: true,
    nextActionIndicatorCoding: true,
  },
  0xF7: {
    description: 'Reserved for proprietary use',
    typeOfCommandCoding: true,
    nextActionIndicatorCoding: true,
  },
  0xF8: {
    description: 'Reserved for proprietary use',
    typeOfCommandCoding: true,
    nextActionIndicatorCoding: true,
  },
  0xF9: {
    description: 'Reserved for proprietary use',
    typeOfCommandCoding: true,
    nextActionIndicatorCoding: true,
  },
  0xFA: {
    description: 'Reserved for proprietary use',
    typeOfCommandCoding: true,
    nextActionIndicatorCoding: true,
  },
  0xFB: {
    description: 'Reserved for proprietary use',
    typeOfCommandCoding: true,
    nextActionIndicatorCoding: true,
  },
  0xFC: {
    description: 'Reserved for proprietary use',
    typeOfCommandCoding: true,
    nextActionIndicatorCoding: true,
  },
  0xFD: {
    description: 'Reserved for proprietary use',
    typeOfCommandCoding: true,
    nextActionIndicatorCoding: true,
  },
  0xFE: {
    description: 'Reserved for proprietary use',
    typeOfCommandCoding: true,
    nextActionIndicatorCoding: true,
  },
};

export default template;
