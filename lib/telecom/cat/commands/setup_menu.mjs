// ETSI TS 102 223 V15.3.0 (2019-07)
// 8.6 Command details

const selectionPreferenceLabels = {
  0: 'no selection preference',
  1: 'selection using soft key preferred',
};

const helpInformationLabels = {
  0: 'no help information available',
  1: 'help information available',
};

export const inspect = decode;

export function encode() {
  throw new Error('Not implemented');
}

export function decode(data) {
  const selectionPreference = data & 1;
  const selectionPreferenceLabel = selectionPreferenceLabels[selectionPreference];

  const helpInformation = (data >> 7) & 1;
  const helpInformationLabel = helpInformationLabels[helpInformation];

  return {
    data,
    selectionPreference,
    selectionPreferenceLabel,
    helpInformation,
    helpInformationLabel,
  };
}
