// BS ISO/IEC 7816-4:2013
// Table 30 — Coding of the security condition byte

import Bitset from '../../../../bitset.mjs';

const conditions = {
  always: 'always',
  never: 'never',
  atLeastOneCondition: 'atLeastOneCondition',
  allConditions: 'allConditions',
  secureMessaging: 'secureMessaging',
  externalAuthentication: 'externalAuthentication',
  userAuthentication: 'userAuthentication',
};

const conditionCoding = {
  4: conditions.userAuthentication,
  5: conditions.externalAuthentication,
  6: conditions.secureMessaging,
};

export const inspect = decode;

export function encode() {
  throw new Error('Not implemented');
}

export function decode(data) {
  const byte = data[0];
  const bitset = Bitset.from(byte, 8);

  const securityCondition = {
    data: bitset,
    conditions: [],
  };

  if (byte === 0) {
    securityCondition.conditions.push(conditions.always);
  } else if (byte === 0xff) {
    securityCondition.conditions.push(conditions.never);
  } else {
    const lo = byte & 0x0f;

    securityCondition.conditions.push(
      bitset.test(7) ? conditions.allConditions : conditions.atLeastOneCondition,
    );

    for (let i = 4; i < 7; i += 1) {
      if (bitset.test(i)) {
        securityCondition.conditions.push(conditionCoding[i]);
      }
    }

    securityCondition.reference = lo > 0 ? lo : undefined;
  }

  return securityCondition;
}
