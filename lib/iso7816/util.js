/* eslint-disable no-console */
const Iso7816Error = require('./iso7816_error');
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
  if (res.data) {
    printBer(res.data, options);
  }
}

function printResOrError(res, options) {
  if (res.noError()) {
    printRes(res, options);
  } else {
    console.log(new Iso7816Error(res.sw));
  }
}

function printResShort(res) {
  console.log(`${res.sw.toString('hex')} ${res?.data?.inspect()}\n`);
}
