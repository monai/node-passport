/* eslint-disable no-console */
const { Iso7816Error } = require('./error');
const { printBer } = require('../util');

module.exports = {
  assertSwOk,
  printRes,
  printResOrError,
  printResShort,
};

function assertSwOk(res) {
  if (!res.noError()) {
    throw new Iso7816Error(res.sw);
  }
}

function printRes(res) {
  printBer(res.toBuffer());
}

function printResOrError(res) {
  if (res.noError()) {
    printRes(res);
  } else {
    console.log(new Iso7816Error(res.sw));
  }
  console.log('\n');
}

function printResShort(res) {
  console.log(`${res.sw.toString('hex')} ${res.toBuffer().inspect()}\n`);
}
