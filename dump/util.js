/* eslint-disable no-console */
const select = require('../lib/iso7816/select');
const readFile = require('../lib/read_file');
const { printBer } = require('../lib/util');
const Iso7816Error = require('../lib/iso7816/iso7816_error');

module.exports = {
  selectApplication,
  dumpFile,
  printError,
};

async function selectApplication(reader, aid, label) {
  console.log('= Select Application:', aid, label);
  const res = await select(reader, 0x04, 0x0c, { data: aid });
  if (!res.noError()) {
    printError(res.toError());
  }
}

async function dumpFile(reader, fileId, options = {}) {
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

function printError(error) {
  if (error instanceof Iso7816Error) {
    console.error(`${error.tag} ${error.message}`);
  } else {
    console.error(error);
  }
}
