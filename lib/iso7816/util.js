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

function printRes(res, options) {
  printBer(res.data, options);
}

function printResOrError(res, options) {
  if (res.noError()) {
    printRes(res, options);
  } else {
    console.log(new Iso7816Error(res.sw));
  }
  console.log('\n');
}

function printResShort(res) {
  console.log(`${res.sw.toString('hex')} ${res?.data?.inspect()}\n`);
}
