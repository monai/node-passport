// BS ISO/IEC 7816-4:2013

// 7.4.10 Life cycle status
export const lifeCycleStatus = {
  noInformationGiven: 'noInformationGiven',
  creationState: 'creationState',
  initialisationState: 'initialisationState',
  operationalStateActivated: 'operationalStateActivated',
  operationalStateDeactivated: 'operationalStateDeactivated',
  terminationState: 'terminationState',
  proprietary: 'proprietary',
};

export function encode() {
  throw new Error('Not implemented');
}

export function decode(data) {
  const byte0 = data[0];

  if (byte0 === 0) {
    return lifeCycleStatus.noInformationGiven;
  }

  if (byte0 === 1) {
    return lifeCycleStatus.creationState;
  }

  if (byte0 === 3) {
    return lifeCycleStatus.initialisationState;
  }

  if (byte0 & 4) {
    if (byte0 & 1) {
      return lifeCycleStatus.operationalStateActivated;
    }

    return lifeCycleStatus.operationalStateDeactivated;
  }

  if (byte0 & 4 && byte0 & 8) {
    return lifeCycleStatus.terminationState;
  }

  if (byte0 >= 16) {
    return lifeCycleStatus.proprietary;
  }

  return undefined;
}
