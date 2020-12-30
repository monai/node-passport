/* eslint-disable no-console */
const { Iso7816Error } = require('./error');
const { printBer } = require('../util');

module.exports = {
  assertSwOk,
  printRes,
  printResOrError,
  printResShort,
};

function assertSwOk(response) {
  if (!response.noError()) {
    throw new Iso7816Error(response.sw);
  }
}

function printRes(response, options) {
  printBer(response.data, options);
}

function printResOrError(response, options) {
  if (response.noError()) {
    printRes(response, options);
  } else {
    console.log(new Iso7816Error(response.sw));
  }
  console.log('\n');
}

function printResShort(response) {
  console.log(`${response.sw.toString('hex')} ${response?.data?.inspect()}\n`);
}
