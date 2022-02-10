/* eslint-disable no-console */
import Iso7816Error from './iso7816_error.js';
import { printBer } from '../util.js';

export function assertSwOk(res) {
  if (!res.noError()) {
    throw new Iso7816Error(res.sw);
  }
}

export function printRes(res, options) {
  if (res.data) {
    printBer(res.data, options);
  }
}

export function printResOrError(res, options) {
  if (res.noError()) {
    printRes(res, options);
  } else {
    console.log(new Iso7816Error(res.sw));
  }
}

export function printResShort(res) {
  console.log(`${res.sw.toString('hex')} ${res?.data?.inspect()}\n`);
}
