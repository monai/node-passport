// ETSI TS 102 223 V15.3.0 (2019-07)

// 5.2 Structure and coding of TERMINAL PROFILE

const labelGroups = [
  // First byte (Download):
  [
    'Profile download',
    'Reserved by 3GPP (SMS-PP data download)',
    'Reserved by 3GPP (Cell Broadcast data download)',
    'Menu selection',
    'Reserved by 3GPP (SMS-PP data download)',
    'Timer expiration',
    'Reserved by 3GPP and 3GPP2 (USSD string data object support in Call Control by USIM)',
    'Call Control by NAA',
  ],
  // Second byte (Other):
  [
    'Command result',
    'Call Control by NAA',
    'Call Control by NAA',
    'reserved by 3GPP (MO short message control support)',
    'Call Control by NAA',
    'UCS2 Entry supported',
    'UCS2 Display supported',
    'Display Text',
  ],
  // Third byte (Proactive UICC):
  [
    'Proactive UICC: DISPLAY TEXT',
    'Proactive UICC: GET INKEY',
    'Proactive UICC: GET INPUT',
    'Proactive UICC: MORE TIME',
    'Proactive UICC: PLAY TONE',
    'Proactive UICC: POLL INTERVAL',
    'Proactive UICC: POLLING OFF',
    'Proactive UICC: REFRESH',
  ],
  // Fourth byte (Proactive UICC):
  [
    'Proactive UICC: SELECT ITEM',
    'Reserved by 3GPP (Proactive UICC: SEND SHORT MESSAGE with 3GPP-SMS-TPDU)',
    'Reserved by 3GPP (Proactive UICC: SEND SS)',
    'Reserved by 3GPP and 3GPP2 (Proactive UICC: SEND USSD)',
    'Proactive UICC: SET UP CALL',
    'Proactive UICC: SET UP MENU',
    'Proactive UICC: PROVIDE LOCAL INFORMATION (MCC, MNC, LAC, Cell ID & IMEI)',
    'Proactive UICC: PROVIDE LOCAL INFORMATION (NMR)',
  ],
  // Fifth byte (Event driven information):
  [
    'Proactive UICC: SET UP EVENT LIST',
    'Event: MT call',
    'Event: Call connected',
    'Event: Call disconnected',
    'Event: Location status',
    'Event: User activity',
    'Event: Idle screen available',
    'Event: Card reader status',
  ],
  // Sixth byte (Event driven information extensions):
  [
    'Event: Language selection',
    'Event: Browser Termination (i.e. class "ac" is supported)',
    'Event: Data available',
    'Event: Channel status',
    'Event: Access Technology Change',
    'Event: Display parameters changed',
    'Event: Local Connection',
    'Event: Network Search Mode Change',
  ],
  // Seventh byte (Multiple card proactive commands) for class "a":
  [
    'Proactive UICC: POWER ON CARD',
    'Proactive UICC: POWER OFF CARD',
    'Proactive UICC: PERFORM CARD APDU',
    'Proactive UICC: GET READER STATUS (Card reader',
    'status)',
    'Proactive UICC: GET READER STATUS (Card reader',
    'identifier)',
    'RFU, bit = 0',
  ],
  // Eighth byte (Proactive UICC):
  [
    'Proactive UICC: TIMER MANAGEMENT (start, stop)',
    'Proactive UICC: TIMER MANAGEMENT (get current value)',
    'Proactive UICC: PROVIDE LOCAL INFORMATION (date, time and time zone)',
    'GET INKEY',
    'SET UP IDLE MODE TEXT',
    'RUN AT COMMAND (i.e. class "b" is supported)',
    'SETUP CALL',
    'Call Control by NAA',
  ],
  // Ninth byte:
  [
    'DISPLAY TEXT',
    'SEND DTMF command',
    'Proactive UICC: PROVIDE LOCAL INFORMATION (NMR)',
    'Proactive UICC: PROVIDE LOCAL INFORMATION (language)',
    'Reserved by 3GPP (Proactive UICC: PROVIDE LOCAL INFORMATION, Timing Advance)',
    'Proactive UICC: LANGUAGE NOTIFICATION',
    'Proactive UICC: LAUNCH BROWSER (i.e. class "ab" is supported)',
    'Proactive UICC: PROVIDE LOCAL INFORMATION (Access Technology)',
  ],
  // Tenth byte (Soft keys support) for class "d":
  [
    'Soft keys support for SELECT ITEM',
    'Soft Keys support for SET UP MENU',
    'RFU, bit = 0',
    'RFU, bit = 0',
    'RFU, bit = 0',
    'RFU, bit = 0',
    'RFU, bit = 0',
    'RFU, bit = 0',
  ],
  // Eleventh byte (Soft keys information):
  [
    "Maximum number of soft keys available 'FF' value is reserved for future use",
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
  ],
  // Twelfth byte (Bearer Independent protocol proactive commands, class "e"):
  [
    'Proactive UICC: OPEN CHANNEL',
    'Proactive UICC: CLOSE CHANNEL',
    'Proactive UICC: RECEIVE DATA',
    'Proactive UICC: SEND DATA',
    'Proactive UICC: GET CHANNEL STATUS',
    'Proactive UICC: SERVICE SEARCH',
    'Proactive UICC: GET SERVICE INFORMATION',
    'Proactive UICC: DECLARE SERVICE',
  ],
  // Thirteenth byte (Bearer Independent protocol supported bearers, class "e"):
  [
    'CSD',
    'GPRS',
    'Bluetooth',
    'IrDA',
    'RS232',
    'Number of channels supported by terminal',
    undefined,
    undefined,
  ],
  // Fourteenth byte (Screen height):
  [
    'Number of characters supported down the terminal display as defined in clause 5.3.1',
    undefined,
    undefined,
    undefined,
    undefined,
    'No display capability (i.e. class "ND" is indicated)',
    'No keypad available (i.e. class "NK" is indicated)',
    'Screen Sizing Parameters supported as defined in clause 5.3',
  ],
  // Fifteenth byte (Screen width):
  [
    'Number of characters supported across the terminal display as defined in clause 5.3.2',
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    'Variable size fonts',
  ],
  // Sixteenth byte (Screen effects):
  [
    'Display can be resized as defined in clause 5.3.3',
    'Text Wrapping supported as defined in clause 5.3.4',
    'Text Scrolling supported as defined in clause 5.3.5',
    'Text Attributes supported as defined in clause 5.3.7',
    'RFU',
    'Width reduction when in a menu as defined in clause 5.3.6',
    undefined,
    undefined,
  ],
  // Seventeenth byte (Bearer independent protocol
  // supported transport interface/bearers, class "e"):
  [
    'TCP, UICC in client mode, remote connection',
    'UDP, UICC in client mode, remote connection',
    'TCP, UICC in server mode',
    'TCP, UICC in client mode, local connection (i.e. class "k" is supported)',
    'UDP, UICC in client mode, local connection (i.e. class "k" is supported)',
    'Direct communication channel (i.e. class "k" is supported)',
    'Reserved by 3GPP (E-UTRAN)',
    'Reserved by 3GPP (HSDPA)',
  ],
  // Eighteenth byte:
  [
    'Proactive UICC: DISPLAY TEXT (Variable Time out)',
    'Proactive UICC: GET INKEY (help is supported while waiting for immediate response or variable timeout)',
    'USB (Bearer Independent protocol supported bearers, class "e")',
    'Proactive UICC: GET INKEY (Variable Timeout)',
    'Proactive UICC: PROVIDE LOCAL INFORMATION (ESN)',
    'Reserved by 3GPP (Call control on GPRS)',
    'Proactive UICC: PROVIDE LOCAL INFORMATION (IMEISV)',
    'Proactive UICC: PROVIDE LOCAL INFORMATION (Search Mode change)',
  ],
  // Nineteenth byte (reserved for TIA/EIA-136-270 facilities):
  [
    'Reserved by TIA/EIA-136-270 (Protocol Version support)',
    'Reserved by TIA/EIA-136-270 (Protocol Version support)',
    'Reserved by TIA/EIA-136-270 (Protocol Version support)',
    'Reserved by TIA/EIA-136-270 (Protocol Version support)',
    'RFU, bit = 0',
    'RFU, bit = 0',
    'RFU, bit = 0',
    'RFU, bit = 0',
  ],
  // Twentieth byte (reserved for 3GPP2 C.S0035-B CCAT):
  [
    'Reserved by CCAT',
    'Reserved by CCAT',
    'Reserved by CCAT',
    'Reserved by CCAT',
    'Reserved by CCAT',
    'Reserved by CCAT',
    'Reserved by CCAT',
    'Reserved by CCAT',
  ],
  // Twenty-first byte (Extended Launch Browser Capability) for class "ac":
  [
    'WML',
    'XHTML',
    'HTML',
    'CHTML',
    'RFU, bit = 0',
    'RFU, bit = 0',
    'RFU, bit = 0',
    'RFU, bit = 0',
  ],
  // Twenty-second byte:
  [
    'Reserved by 3GPP (Support of UTRAN PS with extended parameters)',
    'Proactive UICC: PROVIDE LOCAL INFORMATION(battery state), (i.e. class "g" is supported)',
    'Proactive UICC: PLAY TONE (Melody tones and Themed tones supported)',
    'Multi-media Calls in SET UP CALL (if class h supported)',
    'Reserved by 3GPP (Toolkit-initiated GBA)',
    'Proactive UICC: RETRIEVE MULTIMEDIA MESSAGE (if class "j" is supported)',
    'Proactive UICC: SUBMIT MULTIMEDIA MESSAGE (if class "j" is supported)',
    'Proactive UICC: DISPLAY MULTIMEDIA MESSAGE (if class "j" is supported)',
  ],
  // Twenty third byte:
  [
    'Proactive UICC: SET FRAMES (i.e. class "i" is supported)',
    'Proactive UICC: GET FRAMES STATUS (i.e. class "i" is supported)',
    'MMS notification download (if class "j" is supported)',
    'Alpha Identifier in REFRESH command supported by terminal',
    'Reserved by 3GPP (Geographical Location Reporting)',
    'Proactive UICC: PROVIDE LOCAL INFORMATION (MEID)',
    'Reserved by 3GPP (Proactive UICC: PROVIDE LOCAL INFORMATION (NMR(UTRAN/E-UTRAN)))',
    'Reserved by 3GPP and 3GPP2 (USSD Data download and application mode)',
  ],
  // Twenty fourth byte for class "i":
  [
    'Maximum number of frames supported (including frames created in existing frames)',
    undefined,
    undefined,
    undefined,
    'RFU, bit = 0',
    'RFU, bit = 0',
    'RFU, bit = 0',
    'RFU, bit = 0',
  ],
  // Twenty-fifth byte (Event driven information extensions):
  // If bit "Multiple access technologies supported" is set to 1, it applies
  // to the Event Access Technology Change if supported and all relevant modes
  // of proactive command PROVIDE LOCAL INFORMATION that are supported.
  [
    'Event: Browsing status (i.e. class "ac" is supported)',
    'Event: MMS Transfer status (if class "j" is supported)',
    'Event: Frame Information changed (i.e. class "i" is supported)',
    'Reserved by 3GPP (Event: I-WLAN Access status)',
    'Reserved by 3GPP (Event Network Rejection)',
    'Event: HCI connectivity event (i.e. class "m" is supported)',
    'Reserved by 3GPP (E-UTRAN support in Event Network Rejection)',
    'Multiple access technologies supported in Event Access Technology Change and PROVIDE LOCAL INFORMATION',
  ],
  // Twenty-sixth byte (Event driven information extensions):
  [
    'Reserved by 3GPP (Event : CSG Cell Selection)',
    'Event: Contactless state request (if class "r" is supported)',
    'RFU, bit = 0 (for future event indication)',
    'RFU, bit = 0 (for future event indication)',
    'RFU, bit = 0 (for future event indication)',
    'RFU, bit = 0 (for future event indication)',
    'RFU, bit = 0 (for future event indication)',
    'RFU, bit = 0 (for future event indication)',
  ],
  // Twenty-seventh byte (Event driven information extensions):
  [
    'RFU, bit = 0 (for future event indication)',
    'RFU, bit = 0 (for future event indication)',
    'RFU, bit = 0 (for future event indication)',
    'RFU, bit = 0 (for future event indication)',
    'RFU, bit = 0 (for future event indication)',
    'RFU, bit = 0 (for future event indication)',
    'RFU, bit = 0 (for future event indication)',
    'RFU, bit = 0 (for future event indication)',
  ],
  // Twenty-eighth byte (Text attributes):
  [
    'Alignment left supported by Terminal',
    'Alignment centre supported by Terminal',
    'Alignment right supported by Terminal',
    'Font size normal supported by Terminal',
    'Font size large supported by Terminal',
    'Font size small supported by Terminal',
    'RFU, bit = 0',
    'RFU, bit = 0',
  ],
  // Twenty-ninth byte (Text attributes):
  [
    'Style normal supported by Terminal',
    'Style bold supported by Terminal',
    'Style italic supported by Terminal',
    'Style underlined supported by Terminal',
    'Style strikethrough supported by Terminal',
    'Style text foreground colour supported by Terminal',
    'Style text background colour supported by Terminal',
    'RFU, bit = 0',
  ],
  // Thirtieth byte:
  [
    'Reserved by 3GPP (I-WLAN bearer support)',
    'Reserved by 3GPP (Proactive UICC: PROVIDE LOCAL INFORMATION (WSID of the current I-WLAN connection))',
    'TERMINAL APPLICATIONS (i.e. class "k" is supported)',
    'Reserved by 3GPP (Steering of Roaming REFRESH support)',
    'Proactive UICC: ACTIVATE, bit = 1',
    'Reserved for 3GPP (Proactive UICC: GEOGRAPHICAL LOCATION REQUEST)',
    'Proactive UICC: PROVIDE LOCAL INFORMATION (Broadcast Network Information) (i.e. class "o" is supported)',
    'Reserved by 3GPP (Steering of Roaming for I-WLAN REFRESH support)',
  ],
  // Thirty first byte:
  [
    'Proactive UICC: Contactless State Changed (if class "r" is supported)',
    'Reserved by 3GPP (Support of CSG cell discovery)',
    'Confirmation parameters supported for OPEN CHANNEL in Terminal Server Mode (if classes "e" and "k" are supported)',
    'Reserved by 3GPP (Communication Control for IMS)',
    'Support of CAT over the modem interface (if class "s" is supported)',
    'Reserved by 3GPP (Support for Incoming IMS Data event)',
    'Reserved by 3GPP (Support for IMS Registration event)',
    'Proactive UICC: Profile Container, Envelope Container, COMMAND CONTAINER and ENCAPSULATED SESSION CONTROL (if class "u" is supported)',
  ],
  // Thirty second byte:
  // The bit for CAT service list for eCAT client is only applicable for an eCAT client profile.
  // It shall not be set in the command defined in this clause.
  [
    'Reserved by 3GPP (Support of IMS as a bearer for BIP)',
    'Reserved by 3GPP (Support of PROVIDE LOCATION INFORMATION, H(e)NB IP address)',
    'Reserved by 3GPP (Support of PROVIDE LOCATION INFORMATION, H(e)NB surrounding macrocells)',
    'Launch parameters supported for OPEN CHANNEL in Terminal Server Mode',
    'Direct communication channel supported for OPEN CHANNEL in Terminal Server Mode',
    'Proactive UICC: Security for Profile Container, Envelope Container, COMMAND CONTAINER and ENCAPSULATED SESSION CONTROL (if classes "u" and "x" are supported)',
    'CAT service list for eCAT client',
    'Support of refresh enforcement policy',
  ],
  // Thirty third byte:
  // A terminal that supports DNS server address requests
  // should also support Network Access Name reuse indication.
  [
    'Support of DNS server address request for OPEN CHANNEL related to packet data service bearer (if classes "e" and "aa" are supported)',
    'Support of Network Access Name reuse indication for CLOSE CHANNEL related to packet data service bearer (if classes "e" and "z" are supported)',
    'Event: Poll Interval Negotiation (i.e. class "ad" is supported)',
    'Reserved by 3GPP (ProSe usage information reporting)',
    'Proactive UICC: PROVIDE LOCAL INFORMATION (Supported Radio Access Technologies)',
    'Reserved by 3GPP (Event: WLAN Access status)',
    'Reserved by 3GPP (WLAN bearer support)',
    'Reserved by 3GPP (Proactive UICC: PROVIDE LOCAL INFORMATION (WLAN identifier of the current WLAN connection))',
  ],
  // Thirty fourth byte:
  [
    'Reserved by 3GPP (URI support for SEND SHORT MESSAGE)',
    'Reserved by 3GPP (IMS URI supported for SET UP CALL)',
    'Reserved by 3GPP (Media Type "Voice" supported for SET UP CALL and Call Control by USIM)',
    'Reserved by 3GPP (Media Type "Video" supported for SET UP CALL and Call Control by USIM)',
    'Reserved by 3GPP (Proactive UICC: PROVIDE LOCAL INFORMATION (E-UTRAN Timing Advance Information))',
    'REFRESH with "eUICC Profile State Change" mode',
    'Reserved by 3GPP (Extended Rejection Cause Code in Event: Network Rejection for E-UTRAN)',
    'Deprecated, bit = 0',
  ],
  // Thirty fifth byte:
  [
    'Proactive UICC: GET INPUT (Variable Time out)',
    'Reserved by 3GPP (Data Connection Status Change Event support - PDP Connection)',
    'Reserved by 3GPP (Data Connection Status Change Event support - PDN Connection)',
    'REFRESH with "Application Update" mode (i.e. class "af" is supported)',
    'RFU, bit = 0',
    'RFU, bit = 0',
    'RFU, bit = 0',
    'RFU, bit = 0',
  ],
  // Thirty sixth byte:
  [
    'Reserved by 3GPP (for future usage)',
    'Reserved by 3GPP (for future usage)',
    'Reserved by 3GPP (for future usage)',
    'Reserved by 3GPP (for future usage)',
    'Reserved by 3GPP (for future usage)',
    'Reserved by 3GPP (for future usage)',
    'Reserved by 3GPP (for future usage)',
    'Reserved by 3GPP (for future usage)',
  ],
  // Thirty seventh byte:
  [
    'Reserved by 3GPP (for future usage)',
    'Reserved by 3GPP (for future usage)',
    'Reserved by 3GPP (for future usage)',
    'Reserved by 3GPP (for future usage)',
    'Reserved by 3GPP (for future usage)',
    'Reserved by 3GPP (for future usage)',
    'Reserved by 3GPP (for future usage)',
    'Reserved by 3GPP (for future usage)',
  ],
  // Thirty eighth byte:
  [
    'Reserved by 3GPP (for future usage)',
    'Reserved by 3GPP (for future usage)',
    'Reserved by 3GPP (for future usage)',
    'Reserved by 3GPP (for future usage)',
    'Reserved by 3GPP (for future usage)',
    'Reserved by 3GPP (for future usage)',
    'Reserved by 3GPP (for future usage)',
    'Reserved by 3GPP (for future usage)',
  ],
];

const labels = Object.fromEntries(
  labelGroups.flatMap(
    (byte, i) => byte.map(
      (label, j) => [i * 8 + j, label],
    ),
  ),
);

const integerDecoders = {
  [11 * 8 - 1]: decodeInteger(0, 8),
  [13 * 8 - 1]: decodeInteger(5, 3),
  [14 * 8 - 1]: decodeInteger(0, 5),
  [15 * 8 - 1]: decodeInteger(0, 7),
  [16 * 8 - 1]: decodeInteger(5, 3),
  [24 * 8 - 1]: decodeInteger(0, 4),
};

export function encode() {
  throw new Error('Not implemented');
}

export function* decode(data) {
  for (const [i, byte] of data.entries()) {
    for (let j = 0; j < 8; j += 1) {
      const n = i * 8 + j;
      const label = labels[n];
      let value = (byte >> j) & 0x01;

      if (value && label) {
        if (integerDecoders[n]) {
          value = integerDecoders[n](byte);
        }

        yield [n, value, label];
      }
    }
  }
}

function decodeInteger(start, length) {
  const mask = 0xff >> (8 - length);
  return (byte) => (byte >> start) & mask;
}
