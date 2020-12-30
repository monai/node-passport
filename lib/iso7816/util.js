/* eslint-disable no-console */
const { Iso7816Error } = require('./error');
const { printBer } = require('../util');

module.exports = {
  assertSwOk,
  printResponse,
  printResponseOrError,
  printResponseShort,
};

function assertSwOk(response) {
  if (!response.noError()) {
    throw new Iso7816Error(response.sw);
  }
}

function printResponse(response, options) {
  printBer(response.data, options);
}

function printResponseOrError(response, options) {
  if (response.noError()) {
    printResponse(response, options);
  } else {
    console.log(new Iso7816Error(response.sw));
  }
  console.log('\n');
}

function printResponseShort(response) {
  console.log(`${response.sw.toString('hex')} ${response?.data?.inspect()}\n`);
}
