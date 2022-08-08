import { decode as decodeAddress } from './address.mjs';
import { decode as decodeInteger } from '../../sms/integer.mjs';
import { decode as decodeSmsDataCodingScheme } from '../../sms_data_coding_scheme.mjs';
import Bitset from '../../../bitset.mjs';

import { SCtoMS, MStoSC } from '../../sms/direction.mjs';
import { inspect as inspectTpMti } from '../../sms/tpdu_parameters/mti.mjs';
import { decode as decodeTpPid } from '../../sms/tpdu_parameters/pid.mjs';
import { inspect as inspectTpVpf } from '../../sms/tpdu_parameters/vpf.mjs';
import { decode as decodeTpScts } from '../../sms/tpdu_parameters/scts.mjs';
import { decode as decodeTpUdl } from '../../sms/tpdu_parameters/udl.mjs';
import { decode as decodeCommandPacket } from '../../cat/sms_pp/command_packet.mjs';

// ETSI TS 102 223 V15.3.0 (2019-07)
// 8.13 3GPP-SMS TPDU DO'0B

// ETSI TS 131 111 V15.4.0 (2018-10)
// 8.13 SMS TPDU DO'0B

// ETSI TS 123 040 V16.0.0 (2020-07)

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
  const headerByte = data.slice(0, 1);
  const byte0 = headerByte[0];
  const tpMti = byte0 & 0b11;
  const tpMtiLabel = inspectTpMti(tpMti, { direction: SCtoMS });

  const header = Bitset.from(byte0);
  const tpMms = header.test(2);
  const tpLp = header.test(3);
  const tpRp = header.test(7);
  const tpUdhi = header.test(6);
  const tpSri = header.test(5);
  data = data.slice(1);

  const tpOaLength = data[0];
  data = data.slice(1);
  const tpOaByteLength = Math.ceil(tpOaLength / 2) + 1;
  const tpOaBytes = data.slice(0, tpOaByteLength);
  const tpOa = decodeAddress(tpOaBytes);
  data = data.slice(tpOaByteLength);

  const tpPidByte = data.slice(0, 1);
  const tpPidBits = Bitset.from(tpPidByte[0], 8);
  const tpPid = decodeTpPid(tpPidByte[0]);
  data = data.slice(1);

  const tpDcsByte = data.slice(0, 1);
  const tpDcsBits = Bitset.from(tpDcsByte[0], 8);
  const tpDcs = decodeSmsDataCodingScheme(tpDcsByte[0]);
  data = data.slice(1);

  const tpSctsBytes = data.slice(0, 7);
  const tpScts = decodeTpScts(tpSctsBytes);
  data = data.slice(7);

  const tpUdlByte = data.slice(0, 1);
  const tpUdl = decodeTpUdl(tpUdlByte, { characterSet: tpDcs.characterSet });
  data = data.slice(1);

  // ETSI TS 131 115 V16.0.0 (2020-11)
  // Table 1: Structure of the Command Packet contained in the SM (8 bit data)
  // Length of the Command Packet (CPL), coded over 2 octets,
  // and shall not be coded as the length of BER-TLV data objects described in ETSI TS 101 220
  // Length of the Command Header (CHL), coded over one octet,
  // and shall not be coded as the length of BER-TLV data objects described in ETSI TS 101 220
  const tpUd = decodeCommandPacket(data, { decodeChi, decodeCpl, decodeChl });

  return {
    headerByte,
    header,
    tpMti,
    tpMtiLabel,
    tpMms,
    tpLp,
    tpRp,
    tpUdhi,
    tpSri,
    tpOaBytes,
    tpOa,
    tpPidByte,
    tpPidBits,
    tpPid,
    tpDcsByte,
    tpDcsBits,
    tpDcs,
    tpSctsBytes,
    tpScts,
    tpUdlByte,
    tpUdl,
    tpUd,
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
    tpUdString: tpUd.toString('hex'),
  };
}

// 9.2.2.4 SMS-COMMAND type
function decodeSmsCommand() {
  throw new Error('Not implemented');
}

export const inspect = decode;

export function encode() {
  throw new Error('Not implemented');
}

export function decode(data, { direction }) {
  const byte0 = data[0];
  const tpMti = byte0 & 0b11;

  return decoders[direction][tpMti](data);
}

export function decodeChi() {
  return [null, 0];
}

export function decodeCpl(data) {
  const cpl = decodeInteger(data.slice(0, 2));
  return [cpl, 2];
}

export function decodeChl(data) {
  const chl = decodeInteger(data.slice(0, 1));
  return [chl, 1];
}
