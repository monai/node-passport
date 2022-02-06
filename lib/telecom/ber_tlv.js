// ETSI TS 101 220 V16.0.0 (2021-04)

// Table 7.17
const catTags = {
  0xCF: 'Reserved for proprietary use (direction terminal to UICC)',
  0xD0: 'Proactive Command',
  0xD1: 'GSM/3GPP/3GPP2 - SMS-PP Download',
  0xD2: 'GSM/3GPP/3GPP2 - Cell Broadcast Download',
  0xD3: 'Menu Selection',
  0xD4: 'Call Control',
  0xD5: 'GSM/3GPP/3GPP2 - MO Short Message control',
  0xD6: 'Event Download',
  0xD7: 'Timer Expiration',
  0xD8: 'Reserved for intra-UICC communication and not visible on the card interface',
  0xD9: '3GPP/3GPP2 - USSD Download',
  0xDA: 'MMS Transfer status',
  0xDB: 'MMS notification download',
  0xDC: 'Terminal application tag',
  0xDD: '3GPP - Geographical Location Reporting tag',
  0xDE: 'Envelope Container',
  0xDF: '3GPP - ProSe Report tag',
  0xE0: 'Reserved for 3GPP (for future usage)',
  0xE1: 'Reserved for 3GPP (for future usage)',
  0xE2: 'Reserved for 3GPP (for future usage)',
  0xE3: 'Reserved for 3GPP (for future usage)',
  0xE4: 'Reserved for GSMA (direction terminal to UICC)',
};

module.exports = {
  catTags,
};
