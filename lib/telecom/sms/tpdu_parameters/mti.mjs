// ETSI TS 123 040 V16.0.0 (2020-07)
// 9.2.3.1 TP-Message-Type-Indicator (TP-MTI)

import { SCtoMS, MStoSC } from '../direction.mjs';

export const smsDeliver = 'SMS-DELIVER';
export const smsSubmitReport = 'SMS-SUBMIT-REPORT';
export const smsStatusReport = 'SMS-STATUS-REPORT';
export const smsDeliverReport = 'SMS-DELIVER-REPORT';
export const smsSubmit = 'SMS-SUBMIT';
export const smsCommand = 'SMS-COMMAND';
export const reserved = 'Reserved';

const map = {
  [SCtoMS]: {
    0b00: smsDeliver,
    0b01: smsSubmitReport,
    0b10: smsStatusReport,
    0b11: reserved,
    [smsDeliver]: 0b00,
    [smsSubmitReport]: 0b01,
    [smsStatusReport]: 0b10,
    [reserved]: 0b11,
  },
  [MStoSC]: {
    0b00: smsDeliverReport,
    0b01: smsSubmit,
    0b10: smsCommand,
    0b11: reserved,
    [smsDeliverReport]: 0b00,
    [smsSubmit]: 0b01,
    [smsCommand]: 0b10,
    [reserved]: 0b11,
  },
};

export function encode(data, { direction }) {
  return map[direction][data];
}

export function decode(data) {
  return data;
}

export function inspect(data, { direction }) {
  return map[direction][data];
}
