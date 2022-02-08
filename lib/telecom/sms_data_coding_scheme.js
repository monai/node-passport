// ETSI TS 123 038 V16.0.0 (2020-07)

// 4 SMS Data Coding Scheme
const messageClassLabels = {
  0b00: 'Class 0',
  0b01: 'Class 1 Default meaning: ME-specific.',
  0b10: 'Class 2 (U)SIM specific message',
  0b11: 'Class 3 Default meaning: TE specific (see 3GPP TS 27.005)',
};

const characterLength = {
  0b00: 7,
  0b01: 8,
  0b10: 16,
  0b11: undefined,
};

const characterSetLabels = {
  0b00: 'GSM 7 bit default alphabet',
  0b01: '8 bit data',
  0b10: 'UCS2 (16bit)',
  0b11: 'Reserved',
};

const messageWigLabels = {
  0b00: 'Discard Message',
  0b01: 'Store Message',
  0b10: 'Store Message',
};

const indicationSenseLabels = {
  0: 'Set Indication Inactive',
  1: 'Set Indication Active',
};

const indicationTypeLabels = {
  0b00: 'Voicemail Message Waiting',
  0b01: 'Fax Message Waiting',
  0b10: 'Electronic Mail Message Waiting',
  0b11: 'Other Message Waiting',
};

module.exports = {
  decode,
  characterLength,
};

function decode(byte) {
  const hi = (byte >> 4) & 0x0f;
  if (hi >> 3 === 0) {
    const markedForAutomaticDeletionGroup = !!(hi & 0b0100);
    const compressed = !!(hi & 0b0010);

    let messageClass;
    let messageClassLabel;
    if (hi & 0b0010) {
      messageClass = byte & 0b11;
      messageClassLabel = messageClassLabels[messageClass];
    }

    const characterSet = (byte >> 2) & 0b11;
    const characterSetLabel = characterSetLabels[characterSet];

    // The special case of bits 7..0 being 0000 0000 indicates
    // the GSM 7 bit default alphabet with no message class
    if (byte === 0) {
      messageClass = undefined;
      messageClassLabel = undefined;
    }

    return {
      markedForAutomaticDeletionGroup,
      compressed,
      messageClass,
      messageClassLabel,
      characterSet,
      characterSetLabel,
    };
  }

  if (hi >> 2 === 0b10) {
    return 'Reserved coding group';
  }

  if (hi === 0b1111) {
    const messageClass = byte & 0b11;
    const messageClassLabel = messageClassLabels[messageClass];

    const characterSet = (byte >> 2) & 1;
    const characterSetLabel = characterSetLabels[characterSet];

    return {
      messageClass,
      messageClassLabel,
      characterSet,
      characterSetLabel,
    };
  }

  const messageWig = hi & 0b11;
  const messageWigLabel = messageWigLabels[messageWig];
  const characterSet = hi & 0b10 ? 0b10 : 0b00;
  const characterSetLabel = characterSetLabels[characterSet];
  const indicationSense = byte & 0b100;
  const indicationSenseLabel = indicationSenseLabels[indicationSense];
  const indicationType = byte & 0b11;
  const indicationTypeLabel = indicationTypeLabels[indicationType];

  return {
    messageWaitingIndicationGroup: messageWig,
    messageWaitingIndicationGroupLabel: messageWigLabel,
    characterSet,
    characterSetLabel,
    indicationSense,
    indicationSenseLabel,
    indicationType,
    indicationTypeLabel,
  };
}
