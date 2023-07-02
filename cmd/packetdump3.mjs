import { basename } from 'path';
import { createRequire } from 'module';
import CommandApdu from '../lib/iso7816/command_apdu.mjs';
import ResponseApdu from '../lib/iso7816/response_apdu.mjs';
import Session from '../lib/doc9309/session.mjs';
import { unprotectCommandApdu, unprotectResponseApdu } from '../lib/doc9309/sm.mjs';

const filename = process.argv[2];
const [algorithm, kEnc, kMac] = basename(filename).split('-');

const require = createRequire(import.meta.url);
const data = require(filename);

const dicrectionIndicator = {
  0: '>',
  1: '<',
};

const kEncArg = process.argv[3];
const kMacArg = process.argv[4];

const counterNumberPos = Math.floor(Math.log10(data.length)) + 1;

let sm = false;
const session = new Session(
  algorithm.replace(/_/g, '-'),
  Buffer.from(kEncArg || kEnc, 'hex'),
  Buffer.from(kMacArg || kMac, 'hex'),
);

function aggregate(acc, packet) {
  const direction = parseInt(packet._source.layers.usb['usb.endpoint_address_tree']['usb.endpoint_address.direction'], 10);
  const capdata = Buffer.from(packet._source.layers['usb.capdata'].replace(/:/g, ''), 'hex');

  const last = acc[acc.length - 1] ?? { direction: undefined, packets: [] };
  if (last.direction !== direction) {
    acc.push({ direction, packets: [capdata] });
  } else {
    last.packets.push(capdata);
  }

  return acc;
}

const dataagg = data
  .reduce(aggregate, [])
  .map((p) => ({ ...p, packets: Buffer.concat(p.packets) }));

let i = 0;
for (const { direction, packets } of dataagg.slice(0)) {
  i += 1;

  const dataLength = packets[1];
  const cdata = packets.subarray(10, dataLength + 10);

  let tag = '';
  if ([0x00, 0x40].includes(cdata[1])) {
    const cLength = cdata[2];
    const c = cdata.subarray(3, cLength + 3);

    let apdu;
    let papdu;
    if (direction === 0) {
      papdu = CommandApdu.from(c);

      if (papdu.cla & 0x0c) {
        try {
          apdu = unprotectCommandApdu(session, papdu);
        } catch (ex) {
          // console.error(ex);
          apdu = papdu;
        }

        sm = true;
      } else {
        apdu = papdu;

        sm = false;
      }

      tag = apdu.ins.toString(16).padStart(2, '0').padStart(4, ' ');
    } else {
      papdu = ResponseApdu.fromBuffer(c);

      if (sm) {
        try {
          apdu = unprotectResponseApdu(session, papdu);
        } catch (ex) {
          console.error(ex);
          apdu = papdu;
        }
      } else {
        apdu = papdu;
      }

      tag = apdu.sw.toString(16).padStart(4, '0');
    }

    const counterIndicator = i.toString().padStart(counterNumberPos, '0');
    const smIndicator = sm ? 'Y' : 'N';

    console.log(counterIndicator, dicrectionIndicator[direction], smIndicator, tag, apdu);
  }
}
