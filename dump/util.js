/* eslint-disable no-console */
import Reader from '../lib/reader.js';
import CommandApdu from '../lib/iso7816/command_apdu.js';
import Iso7816Error from '../lib/iso7816/iso7816_error.js';
import select from '../lib/iso7816/select.js';
import readFile from '../lib/read_file.js';
import { printBer } from '../lib/util.js';

export async function main(fn) {
  const reader = new Reader();
  reader.once('state', (state) => {
    if (state === 'present') {
      fn(reader)
        .catch((error) => console.error('main error', error))
        .finally(() => {
          reader.close();
        });
    }
  });
}

export async function selectApplication(reader, aid, label) {
  console.log('= Select Application:', aid, label);
  const res = await select(reader, 0x04, 0x0c, { data: aid });
  if (!res.noError()) {
    printError(res.toError());
  }
}

export async function dumpFile(reader, fileId, options = {}) {
  let res;

  options = { parse: true, ...options };

  console.log(`= Select File: ${fileId} ${options.label || ''}`);
  res = await select(reader, 0x02, 0x04, { data: fileId, bl: 0x100 });
  if (!res.noError()) {
    printError(res.toError());
    return undefined;
  }
  printBer(res.data);
  console.log('---');

  res = await readFile(reader, { fileId, le: 0xff });
  if (options.parse) {
    printBer(res, { noTail: true });
  } else {
    console.log(res.toString('hex'));
  }

  return res;
}

export async function mseRestore(reader, seid) {
  const apdu = new CommandApdu(0x00, 0x22, 0xf3, seid);
  console.log('MSE:RESTORE', apdu.toDebugString());
  const res = await reader.transmit(apdu);
  printResOrError(res);

  return res;
}

export async function verify(reader, data) {
  const apdu = new CommandApdu(0x00, 0x20, 0x00, 0x81, { data });
  console.log('VERIFY', apdu.toDebugString());
  const res = await reader.transmit(apdu);
  printResOrError(res);
}

export function printError(error) {
  if (error instanceof Iso7816Error) {
    console.error(`${error.tag} ${error.message}`);
  } else {
    console.error(error);
  }
}

export function printResOrError(obj) {
  if (obj.noError()) {
    console.log(obj);
  } else {
    printError(obj.toError());
  }
}
