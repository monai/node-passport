import { decode as decodeAddress } from './address.mjs';
import { decode as decodeInteger } from '../../sms/integer.mjs';
import { decode as decodeSmsDataCodingScheme } from '../../sms_data_coding_scheme.mjs';
import Bitset from './bitset.mjs';

import { SCtoMS, MStoSC } from '../../sms/direction.mjs';
import { inspect as inspectTpMti } from '../../sms/tpdu_parameters/mti.mjs';
import { decode as decodeTpPid } from '../../sms/tpdu_parameters/pid.mjs';
import { inspect as inspectTpVpf } from '../../sms/tpdu_parameters/vpf.mjs';
import { decode as decodeTpScts } from '../../sms/tpdu_parameters/scts.mjs';
import { decode as decodeTpUdl } from '../../sms/tpdu_parameters/udl.mjs';
import { decode as decodeTpUdh } from '../../sms/tpdu_parameters/udh.mjs';
import { decode as decodeCommandPacket } from '../../cat/secured_packet/command_packet.mjs';

// ETSI TS 102 223 V15.3.0 (2019-07)
// 8.13 3GPP-SMS TPDU DO'0B

// ETSI TS 131 111 V15.4.0 (2018-10)
// 8.13 SMS TPDU DO'0B

// ETSI TS 123 040 V16.0.0 (2020-07)

// 9.2.3.24 TP-User Data (TP-UD)

// ETSI TS 131 115 V16.0.0 (2020-11)
// 4.2 Structure of the Command Packet contained in a Single Short Message Point to Point


const decoders = {
  [SCtoMS]: {
    0b00: decodeSmsDeliver,
    0b01: decodeSmsSubmitReport,
    0b10: decodeSmsStatusReport,
    0b11: decodeSmsDeliver,
  },
  [MStoSC]: {
    0b00: decodeSmsDeliverReport,
    0b01: decodeSmsSubmit,
    0b10: decodeSmsCommand,
    0b11: () => {},
  },
};

// 9.2.2.1 SMS-DELIVER type
function decodeSmsDeliver(data) {
  const byte0 = data[0];
  const tpMti = byte0 & 0b11;
  const tpMtiLabel = inspectTpMti(tpMti, { direction: SCtoMS });

  const header = new Bitset(byte0);
  const tpMms = header.test(2);
  const tpLp = header.test(3);
  const tpRp = header.test(7);
  const tpUdhi = header.test(6);
  const tpSri = header.test(5);
  data = data.slice(1);

  const tpOaLength = data[0];
  data = data.slice(1);
  const tpOaByteLength = Math.ceil(tpOaLength / 2) + 1;
  const tpOa = decodeAddress(data.slice(0, tpOaByteLength));
  data = data.slice(tpOaByteLength);

  const tpPidBits = Bitset.from(data[0], 8);
  const tpPid = decodeTpPid(data[0]);
  data = data.slice(1);

  const tpDcsBits = Bitset.from(data[0], 8);
  const tpDcs = decodeSmsDataCodingScheme(data[0]);
  data = data.slice(1);

  const tpScts = decodeTpScts(data.slice(0, 7));
  data = data.slice(7);

  const tpUdl = decodeTpUdl(data.slice(0, 1), { characterSet: tpDcs.characterSet });
  data = data.slice(1);

  let udhl;
  let udh;
  if (tpUdhi) {
    [udhl] = data;
    data = data.slice(1);
    udh = decodeUdh(data.slice(0, udhl));
    data = data.slice(udhl);
  }

  const tpUd = data;
  const commandPacket = decodeCommandPacket(data, udh?.[0]);

  return {
    tpMti,
    tpMtiLabel,
    tpMms,
    tpLp,
    tpRp,
    tpUdhi,
    tpSri,
    tpOa,
    tpPidBits,
    tpPid,
    tpDcsBits,
    tpDcs,
    tpScts,
    tpUdl,
    tpUd: {
      udhl,
      udh,
      tpUd,
      commandPacket,
    },
  };
}

// 9.2.2.2a SMS-SUBMIT-REPORT type
function decodeSmsSubmitReport() {
  throw new Error('Not implemented');
}

// 9.2.2.3 SMS-STATUS-REPORT type
function decodeSmsStatusReport() {
  throw new Error('Not implemented');
}

// 9.2.2.1a SMS-DELIVER-REPORT type
function decodeSmsDeliverReport() {
  throw new Error('Not implemented');
}

// 9.2.2.2 SMS-SUBMIT type
function decodeSmsSubmit(data) {
  const byte0 = data[0];
  const tpMti = byte0 & 0b11;
  const tpMtiLabel = inspectTpMti(tpMti, { direction: MStoSC });

  const tpVpf = (byte0 >> 2) & 0b11;
  const tpVpfLabel = inspectTpVpf(tpVpf);

  const header = new Bitset(byte0, 8);
  const tpRp = header.test(7);
  const tpUdhi = header.test(6);
  const tpSrr = header.test(5);
  data = data.slice(1);

  const tpMr = decodeInteger(data.slice(0, 1));
  data = data.slice(1);

  const tpDaLength = data[0];
  data = data.slice(1);
  const tpDaByteLength = Math.ceil(tpDaLength / 2) + 1;
  const tpDa = decodeAddress(data.slice(0, tpDaByteLength));
  data = data.slice(tpDaByteLength);

  const tpPidBits = Bitset.from(data[0], 8);
  const tpPid = decodeTpPid(data[0]);
  data = data.slice(1);

  const tpDcsBits = Bitset.from(data[0], 8);
  const tpDcs = decodeSmsDataCodingScheme(data[0]);
  data = data.slice(1);

  const tpUdl = decodeTpUdl(data.slice(0, 1), { characterSet: tpDcs.characterSet });
  data = data.slice(1);
  const tpUd = data;

  return {
    tpMti,
    tpMtiLabel,
    tpVpf,
    tpVpfLabel,
    tpRp,
    tpUdhi,
    tpSrr,
    tpMr,
    tpDa,
    tpPidBits,
    tpPid,
    tpDcsBits,
    tpDcs,
    tpUdl,
    tpUd,
  };
}

// 9.2.2.4 SMS-COMMAND type
function decodeSmsCommand() {
  throw new Error('Not implemented');
}

export function decode(data, dir) {
  const byte0 = data[0];
  const tpMti = byte0 & 0b11;

  return decoders[dir][tpMti](data);
}
