// ETSI TS 101 220 V16.0.0 (2021-04)

// 7.2 Assigned TLV tag values
// Table 7.17
const templates = {
  0xCF: {
    description: 'Reserved for proprietary use (direction terminal to UICC)',
  },
  0xD0: {
    description: 'Proactive Command',
  },
  0xD1: {
    description: 'GSM/3GPP/3GPP2 - SMS-PP Download',
  },
  0xD2: {
    description: 'GSM/3GPP/3GPP2 - Cell Broadcast Download',
  },
  0xD3: {
    description: 'Menu Selection',
  },
  0xD4: {
    description: 'Call Control',
  },
  0xD5: {
    description: 'GSM/3GPP/3GPP2 - MO Short Message control',
  },
  0xD6: {
    description: 'Event Download',
  },
  0xD7: {
    description: 'Timer Expiration',
  },
  0xD8: {
    description: 'Reserved for intra-UICC communication and not visible on the card interface',
  },
  0xD9: {
    description: '3GPP/3GPP2 - USSD Download',
  },
  0xDA: {
    description: 'MMS Transfer status',
  },
  0xDB: {
    description: 'MMS notification download',
  },
  0xDC: {
    description: 'Terminal application tag',
  },
  0xDD: {
    description: '3GPP - Geographical Location Reporting tag',
  },
  0xDE: {
    description: 'Envelope Container',
  },
  0xDF: {
    description: '3GPP - ProSe Report tag',
  },
  0xE0: {
    description: 'Reserved for 3GPP (for future usage)',
  },
  0xE1: {
    description: 'Reserved for 3GPP (for future usage)',
  },
  0xE2: {
    description: 'Reserved for 3GPP (for future usage)',
  },
  0xE3: {
    description: 'Reserved for 3GPP (for future usage)',
  },
  0xE4: {
    description: 'Reserved for GSMA (direction terminal to UICC)',
  },
};

module.exports = templates;
