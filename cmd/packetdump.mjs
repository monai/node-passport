/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
import { createRequire } from 'module';
import { basename, resolve } from 'path';
import CommandApdu from '../lib/iso7816/command_apdu.mjs';
import ResponseApdu from '../lib/iso7816/response_apdu.mjs';
import Session from '../lib/doc9309/session.mjs';
import { unprotectCommandApdu, unprotectResponseApdu } from '../lib/doc9309/sm.mjs';

export default function main(program, filename) {
  if (!filename) {
    console.log(`Usage: ${program} FILE\n\nFile pattern: algorithm-kEnc-kMac-name.json`);
    process.exit(0);
  }

  filename = resolve(process.cwd(), process.argv[2]);
  const [algorithm, kEnc, kMac] = basename(filename).split('-');

  const session = new Session(
    algorithm.replace(/_/g, '-'),
    Buffer.from(kEnc, 'hex'),
    Buffer.from(kMac, 'hex'),
  );

  const require = createRequire(import.meta.url);
  // eslint-disable-next-line global-require, import/no-dynamic-require, no-undef
  require(filename)
    .map(prepare)
    .reduce(concat, [])
    .reduce(unprotect(session), {
      sm: false,
      apdus: [],
    })
    .forEach(print);
}

function prepare(doc) {
  return {
    direction: parseInt(
      doc._source.layers.usb['usb.endpoint_address.number_tree']['usb.endpoint_address.direction'],
      10,
    ),
    data: Buffer.from(
      doc._source.layers['usb.capdata'].replace(/:/g, ''),
      'hex',
    ).subarray(10),
  };
}

function concat(acc, curr) {
  if (!acc.length) {
    acc.push(curr);
  } else {
    const prev = acc[acc.length - 1];
    if (prev.direction === curr.direction) {
      prev.data = Buffer.concat([prev.data, curr.data]);
    } else {
      acc.push(curr);
    }
  }

  return acc;
}

function unprotect(session) {
  return (state, packet, i, ary) => {
    const out = {
      packet,
    };

    if (packet.direction === 0) {
      const papdu = CommandApdu.from(packet.data);

      if (packet.data[0] & 0x0c) {
        let apdu;
        try {
          apdu = unprotectCommandApdu(session, papdu);
        } catch (ex) {
          apdu = papdu;
        }

        out.apdu = apdu;
        out.protectedApdu = papdu;
        state.sm = true;
      } else {
        out.apdu = papdu;
      }
    } else if (packet.direction === 1) {
      const papdu = new ResponseApdu(packet.data);

      if (state.sm) {
        let apdu;

        try {
          apdu = unprotectResponseApdu(session, papdu);
        } catch (ex) {
          apdu = papdu;
        }

        out.apdu = apdu;
        out.protectedApdu = papdu;
        state.sm = false;
      } else {
        out.apdu = papdu;
      }
    }

    state.apdus.push(out);
    return i + 1 < ary.length ? state : state.apdus;
  };
}

function print(chunk) {
  const directions = ['>', '<'];

  console.log(`${directions[chunk.packet.direction]} ${chunk.apdu.toDebugString()}`);
}
