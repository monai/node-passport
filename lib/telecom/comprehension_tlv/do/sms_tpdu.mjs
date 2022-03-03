import { decode as decodeAddress } from './address.mjs';
import { decode as decodeSemiOctet } from '../../sms/semi_octet_numeric.mjs';
import { decode as decodeInteger } from '../../sms/integer.mjs';
import { decode as decodeSmsDataCodingScheme, characterLength } from '../../sms_data_coding_scheme.mjs';
import { decode as decodeSpi } from '../../cat/secured_packet/spi.mjs';
import { decode as decodeKic } from '../../cat/secured_packet/kic.mjs';
import { decode as decodeKid } from '../../cat/secured_packet/kid.mjs';
import Bitset from './bitset.mjs';

import { SCtoMS, MStoSC } from '../../sms/direction.mjs';
import { inspect as inspectTpMti } from '../../sms/tpdu_parameters/mti.mjs';
import { decode as decodeTpPid } from '../../sms/tpdu_parameters/pid.mjs';
// ETSI TS 102 223 V15.3.0 (2019-07)
// 8.13 3GPP-SMS TPDU DO'0B

// ETSI TS 131 111 V15.4.0 (2018-10)
// 8.13 SMS TPDU DO'0B

// ETSI TS 123 040 V16.0.0 (2020-07)
// 9.2.3.3 TP-Validity-Period-Format (TP-VPF)
const tpVpfLabels = {
  0b00: 'not present',
  0b01: 'relative format',
  0b10: 'enhanced format',
  0b11: 'absolute format',
};

// 9.2.3.11 TP-Service-Centre-Time-Stamp (TP-SCTS)
function decodeScts(data) {
  const nibs = Array.from(decodeSemiOctet(data));
  const parts = [];
  for (let i = 0; i < nibs.length; i += 2) {
    parts.push(nibs[i] * 10 + nibs[i + 1]);
  }

  const [y, m, d, H, M, S, z] = parts;
  const yy = y + 2000;
  const mm = m - 1;
  const MM = M + z * 15;

  return new Date(Date.UTC(yy, mm, d, H, MM, S));
}

// 9.2.3.16 TP-User-Data-Length (TP-UDL)
function decodeUdl(data, characterSet) {
  const charLength = characterLength[characterSet];
  let length = decodeInteger(data);
  if (charLength === 7) {
    length = Math.ceil((length / 8) * 7);
  }

  return length;
}

// 9.2.3.24 TP-User Data (TP-UD)
function decodeUdh(data) {
  const out = [];

  let read = 0;
  while (read < data.length) {
    const iei = data[0];
    const ieidl = data[1];

    const ie = {
      iei,
      ieidl,
    };

    if (ieidl) {
      ie.ied = data.slice(2, ieidl);
    }

    out.push(ie);

    read += 2 + ieidl;
  }

  return out;
}

// ETSI TS 131 115 V16.0.0 (2020-11)
// 4.2 Structure of the Command Packet contained in a Single Short Message Point to Point
function decodeCommandPacket(data, iea) {
  const cpl = decodeInteger(data.slice(0, 2));
  data = data.slice(2);

  const chl = decodeInteger(data.slice(0, 1));
  data = data.slice(1);

  const spiBytes = data.slice(0, 2);
  const spi = decodeSpi(spiBytes);
  data = data.slice(2);

  const kicBytes = data.slice(0, 1);
  const kic = decodeKic(kicBytes);
  data = data.slice(1);

  const kidBytes = data.slice(0, 1);
  const kid = decodeKid(kidBytes, spi.B1b2b1);
  data = data.slice(1);

  const tar = data.slice(0, 3);
  data = data.slice(3);

  const cntr = data.slice(0, 5);
  data = data.slice(5);

  const pcntr = data.slice(0, 1);
  data = data.slice(1);

  const rcccdsl = chl - 13;
  const rcccds = data.slice(0, rcccdsl);
  data = data.slice(rcccdsl);

  const out = {
    cpi: iea.iei,
    cpl,
    chi: null,
    chl,
    spiBytes,
    spi,
    kicBytes,
    kic,
    kidBytes,
    kid,
    tar,
    tarString: tar.toString(),
    cntr,
    pcntr,
    rcccds,
    securedDataLength: data.length,
    securedData: data,
  };

  return out;
}

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

  const tpDcsBits = data[0].toString(2).padStart(8, '0');
  const tpDcs = decodeSmsDataCodingScheme(data[0]);
  data = data.slice(1);

  const tpScts = decodeScts(data.slice(0, 7));
  data = data.slice(7);

  const tpUdl = decodeUdl(data.slice(0, 1), tpDcs.characterSet);
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
  const tpVpfLabel = tpVpfLabels[tpVpf];

  const header = new Bitset(byte0);
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

  const tpDcsBits = data[0].toString(2).padStart(8, '0');
  const tpDcs = decodeSmsDataCodingScheme(data[0]);
  data = data.slice(1);

  const tpUdl = decodeUdl(data.slice(0, 1), tpDcs.characterSet);
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
