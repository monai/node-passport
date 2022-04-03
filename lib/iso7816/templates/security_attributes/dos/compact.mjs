// ISO/IEC 7816-4:2013
// Table 17 — Coding of the sole byte in an access mode field for DFs

import { dedicatedFile, elementaryFile, dataObject } from '../../../data_structure.mjs';
import Bitset from '../../../../bitset.mjs';

const type = {
  dedicatedFile,
  elementaryFile,
  dataObject,
  securityObject: 'securityObject',
  tableAndView: 'tableAndView',
};

const soleDf = {
  6: 'DELETE FILE (self)',
  5: 'TERMINATE CARD USAGE (MF), TERMINATE DF',
  4: 'ACTIVATE FILE',
  3: 'DEACTIVATE FILE',
  2: 'CREATE FILE (DF creation)',
  1: 'CREATE FILE (EF creation)',
  0: 'DELETE FILE (child)',
};

const soleEf = {
  6: 'DELETE FILE',
  5: 'TERMINATE EF',
  4: 'ACTIVATE FILE, ACTIVATE RECORD(S)',
  3: 'DEACTIVATE FILE, DEACTIVATE RECORD(S)',
  2: 'WRITE BINARY, WRITE RECORD, APPEND RECORD',
  1: 'UPDATE BINARY, UPDATE RECORD, ERASE BINARY, ERASE RECORD(S)',
  0: 'READ BINARY/RECORD(S), SEARCH BINARY/RECORD, COMPARE BINARY/RECORD',
};

const soleDo = {
  6: 'DELETE DATA',
  5: 'MANAGE DATA Terminate',
  4: 'MANAGE DATA Activate',
  3: 'MANAGE DATA Deactivate',
  2: 'MANAGE SECURITY ENVIRONMENT',
  1: 'PUT DATA/PUT NEXT DATA/UPDATE DATA',
  0: 'GET DATA/GET NEXT DATA/COMPARE DATA',
};

const soleSo = {
  6: 'RFU',
  5: 'TERMINATE (operation)',
  4: 'ACTIVATE (operation)',
  3: 'DEACTIVATE (operation)',
  2: 'RFU',
  1: 'PUT/UPDATE (operation)',
  0: 'GET (operation)',
};

const soleTv = {
  6: 'CREATE USER, DELETE USER',
  5: 'GRANT, REVOKE',
  4: 'CREATE TABLE, CREATE VIEW, CREATE DICTIONARY',
  3: 'DROP TABLE, DROP VIEW',
  2: 'INSERT',
  1: 'UPDATE, DELETE',
  0: 'FETCH',
};

const sole = {
  [type.dedicatedFile]: soleDf,
  [type.elementaryFile]: soleEf,
  [type.dataObject]: soleDo,
  [type.securityObject]: soleSo,
  [type.tableAndView]: soleTv,
};

const multipleDf = [
  {
    5: 'TERMINATE CARD USAGE (MF), TERMINATE DF',
    4: 'ACTIVATE FILE',
    3: 'DEACTIVATE FILE',
    2: 'CREATE FILE (DF creation)',
    1: 'CREATE FILE (EF creation)',
    0: 'DELETE FILE (child)',
  },
  {
    5: 'DELETE FILE (self)',
    4: 'APPLICATION MANAGEMENT REQUEST',
    3: 'REMOVE APPLICATION',
    2: 'RFU',
    1: 'RFU',
    0: 'RFU',
  },
  {
    5: 'RFU',
    4: 'RFU',
    3: 'RFU',
    2: 'RFU',
    1: 'command creating data objects (see ISO/IEC 7816-9)',
    0: 'DELETE DATA',
  },
];

const multipleEf = [
  {
    5: 'TERMINATE EF',
    4: 'ACTIVATE FILE, ACTIVATE RECORD(S)',
    3: 'DEACTIVATE FILE, DEACTIVATE RECORD(S)',
    2: 'APPEND RECORD',
    1: 'UPDATE BINARY, UPDATE RECORD',
    0: 'READ BINARY/RECORD(S), SEARCH BINARY/RECORD',
  },
  {
    5: 'DELETE EF',
    4: 'RFU',
    3: 'RFU',
    2: 'WRITE BINARY, WRITE RECORD',
    1: 'ERASE BINARY, ERASE RECORD(S)',
    0: 'COMPARE BINARY/RECORD',
  },
  {
    5: 'RFU',
    4: 'RFU',
    3: 'RFU',
    2: 'RFU',
    1: 'command creating data objects (see ISO/IEC 7816-9)',
    0: 'DELETE DATA',
  },
];

const multipleDo = [
  {
    5: 'MANAGE DATA Terminate',
    4: 'MANAGE DATA Activate',
    3: 'MANAGE DATA Deactivate',
    2: 'MANAGE SECURITY ENVIRONMENT',
    1: 'PUT DATA/UPDATE DATA',
    0: 'GET DATA/GET NEXT DATA',
  },
  {
    5: 'DELETE DATA',
    4: 'command creating data objects (see ISO/IEC 7816-9)',
    3: 'RFU',
    2: 'RFU',
    1: 'PUT NEXT DATA',
    0: 'COMPARE DATA',
  },
];

const multiple = {
  [type.dedicatedFile]: multipleDf,
  [type.elementaryFile]: multipleEf,
  [type.dataObject]: multipleDo,
};

const proprietary = 'Proprietary';

export const inspect = decode;

export function encode() {
  throw new Error('Not implemented');
}

export function decode(data, { type }) {
  const byte0 = data[0];

  const out = [];
  while (data.length > 0) {
    if (byte0 === 0x00) {
      data = data.slice(1);
      for (const [n, byte] of data.entries()) {
        const labels = multiple[type][n];
        const b7 = (byte >> 6) & 1;
        const isProprietary = b7 === 1;
        const length = isProprietary ? 0 : 6;

        const accessModeField = decodeAccessModeByte(byte, isProprietary, length, labels);
        data = data.slice(1);
        const securityConditions = decodeSecurityConditionBytes(accessModeField, data);
        data = data.slice(securityConditions.length);

        out.push({
          accessModeField,
          securityConditions,
        });

        if (byte & 0x80) {
          data = data.slice(n + 1);
          break;
        }
      }
    } else {
      const byte = data[0];
      const labels = sole[type];
      const b8 = (data[0] >> 7) & 1;
      const isProprietary = b8 === 1;
      const length = isProprietary ? 3 : 7;

      const accessModeField = decodeAccessModeByte(byte, isProprietary, length, labels);
      data = data.slice(1);
      const securityConditions = decodeSecurityConditionBytes(accessModeField, data);
      data = data.slice(securityConditions.length);

      out.push({
        accessModeField,
        securityConditions,
      });
    }
  }

  return out;
}

function decodeAccessModeByte(byte, isProprietary, length, labels) {
  const amb = Bitset.from(byte, 8);
  const ambLabels = selectLabels(amb, length, labels);
  if (isProprietary) {
    ambLabels.push(proprietary);
  }

  return {
    data: amb,
    labels: ambLabels,
  };
}

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

function decodeSecurityConditionBytes(accessModeField, data) {
  const out = [];

  let i = 0;
  for (const value of accessModeField.data) {
    if (value) {
      const byte = data[i];
      i += 1;
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

        for (let j = 4; i < 7; i += 1) {
          if (bitset.test(i)) {
            securityCondition.conditions.push(conditionCoding[j]);
          }
        }

        securityCondition.reference = lo > 0 ? lo : undefined;
      }

      out.push(securityCondition);
    }
  }

  return out;
}

function selectLabels(amb, length, labels) {
  const out = [];
  for (let i = 0; i < length; i += 1) {
    if (amb.test(i)) {
      out.push(labels[i]);
    }
  }

  return out;
}
