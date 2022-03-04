// ETSI TS 131 115 V16.0.0 (2020-11)
// 4.1 Structure of the UDH in a secured Short Message Point to Point

import { read as readUdh, decode as decodeUdh } from '../../sms/tpdu_parameters/udh.mjs';
import { decode as decodeCommandPacket } from '../secured_packet/command_packet.mjs';

export const inspect = decode;

export function encode() {
  throw new Error('Not implemented');
}

export function decode(data) {
  const [udhData, rl] = readUdh(data);

  const udhl = udhData.length;
  const udh = decodeUdh(udhData);
  data = data.slice(rl);

  const [ieia] = udh;
  const ud = Buffer.concat([
    Buffer.from([ieia.iei]),
    data,
  ]);
  const commandPacket = decodeCommandPacket(ud);

  return {
    udhl,
    udh,
    commandPacket,
  };
}
