/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
import { createRequire } from 'module';
import { basename, resolve } from 'path';
import minimist from 'minimist';
import CommandApdu from '../lib/iso7816/command_apdu.mjs';
import ResponseApdu from '../lib/iso7816/response_apdu.mjs';
import Session from '../lib/doc9309/session.mjs';
import { unprotectCommandApdu, unprotectResponseApdu } from '../lib/doc9309/sm.mjs';

export default function main(argv) {
  const args = minimist(
    argv.slice(1),
    {
      alias: {
        skip: ['s'],
        help: ['h'],
      },
      default: {
        skip: 0,
      },
    },
  );

  if (args.help || args._.length === 0) {
    console.log(`Usage: ${argv[0]} FILE\n`);
    console.log('  -s,  --skip=NUMBER       Skip NUMBER lines\n');
    console.log('File pattern: algorithm-kEnc-kMac-name.json');
    process.exit(0);
  }

  const filename = resolve(process.cwd(), args._[0]);
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
    .slice(args.skip)
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
      const papdu = ResponseApdu.fromBuffer(packet.data);

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

function print(chunk, index) {
  const directions = ['>', '<'];
  const indexLabel = index.toString().padStart(3, '0');

  console.log(`${indexLabel} ${directions[chunk.packet.direction]} ${chunk.apdu.toDebugString()}`);
}
