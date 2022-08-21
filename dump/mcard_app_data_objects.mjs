/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
import dotenv from 'dotenv';
import SimpleReader from '../lib/simple_reader.mjs';
import SecureReader from '../lib/secure_reader.mjs';
import select from '../lib/iso7816/select.mjs';
import readEntireBinary from '../lib/iso7816/read_entire_binary.mjs';
import CommandApdu from '../lib/iso7816/command_apdu.mjs';
// import performPace from '../lib/doc9309/perform_pace.mjs';
import { performPace } from '../lib/doc9309/perform_pace_old.mjs';
import { main, printError } from './util.mjs';
import printBer from '../lib/asn1/util/print_ber.mjs';
import fciTemplate from '../lib/iso7816/templates/file_control_information/fci.mjs';
import efDirTemplate from '../lib/pkcs15/templates/ef_dir.mjs';
import efOdTemplate from '../lib/doc9309/templates/ef_od.mjs';
import efCiainfoTemplate from '../lib/doc9309/templates/ef_ciainfo.mjs';
import securityInfosForPace from '../lib/doc9309/templates/security_infos_for_pace.mjs';
import readBinary from '../lib/iso7816/read_binary.mjs';

dotenv.config();

main(work);
async function work(reader) {
  console.log(`= ATR: ${reader.atr.toString('hex')}`);

  const simpleReader = new SimpleReader(reader);
  let res;

  await reader.connect({ share_mode: reader.reader.SCARD_SHARE_SHARED });

  console.log('= Get Challenge');
  res = await getChallenge(simpleReader, 0x20);
  if (!res.noError()) {
    printError(res.toError());
  } else {
    console.log(res.data);
  }

  console.log('= Select MF: 3F00');
  res = await select(simpleReader, 0x00, 0x00, { data: '3F00', le: 0x100 });
  if (!res.noError()) {
    printError(res.toError());
  } else {
    printBer(res.data, { template: fciTemplate });
  }

  console.log('= Select EF.DIR: 2F00');
  res = await select(simpleReader, 0x00, 0x00, { data: '2F00', le: 0x100 });
  if (!res.noError()) {
    printError(res.toError());
  } else {
    printBer(res.data, { template: fciTemplate });
  }

  console.log(' <= Response');
  res = await readBinary(simpleReader, 0x00, 0x100);
  if (!res.noError()) {
    printError(res.toError());
  } else {
    printBer(res.data, { template: efDirTemplate });
  }

  console.log('= Select EF.CardAccess: 011C');
  res = await select(simpleReader, 0x00, 0x00, { data: '011C', le: 0x100 });
  if (!res.noError()) {
    printError(res.toError());
  } else {
    printBer(res.data, { template: fciTemplate });
  }

  console.log(' <= Response');
  res = await readBinary(simpleReader, 0x00, 0x100);
  if (!res.noError()) {
    printError(res.toError());
  } else {
    printBer(res.data, { noTail: true, template: securityInfosForPace });
  }

  const can = Buffer.from(process.env.LITEID_2021_CAN);
  console.log('= Perform PACE');
  const session = await performPace(simpleReader, {
    password: can,
    passwordType: 'id-CAN',
    reference: 'id-CAN',
    protocol: 'id-PACE-ECDH-GM-AES-CBC-CMAC-128',
    standardizedDomainParametersId: 12,
  });
  const secureReader = new SecureReader(reader, session);

  console.log('= Select File: df02');
  res = await select(secureReader, 0x08, 0x00, { data: 'df02', le: 0x100 });
  if (!res.noError()) {
    printError(res.toError());
  } else {
    printBer(res.data, { template: fciTemplate });
  }

  console.log('= Select EF.CIAInfo: 5032');
  res = await select(secureReader, 0x00, 0x00, { data: '5032', le: 0x100 });
  if (!res.noError()) {
    printError(res.toError());
  } else {
    printBer(res.data, { template: fciTemplate });
  }

  console.log(' <= Response');
  res = await readEntireBinary(secureReader, { le: 0xdf });
  printBer(res, { template: efCiainfoTemplate, noTail: true });

  console.log('= Select EF.OD: 5031');
  res = await select(secureReader, 0x00, 0x00, { data: '5031', le: 0x100 });
  if (!res.noError()) {
    printError(res.toError());
  } else {
    printBer(res.data, { template: fciTemplate });
  }

  console.log(' <= Response');
  res = await readEntireBinary(secureReader, { le: 0xdf });
  printBer(res, { template: efOdTemplate, noTail: true });

  console.log('= Select EF.PrKD: 1f01');
  res = await select(secureReader, 0x00, 0x00, { data: '1f01', le: 0x100 });
  if (!res.noError()) {
    printError(res.toError());
  } else {
    printBer(res.data, { template: fciTemplate });
  }

  console.log(' <= Response');
  res = await readEntireBinary(secureReader, { le: 0xdf });
  printBer(res, { noTail: true });

  console.log('= Select EF.PuKD: 1f02');
  res = await select(secureReader, 0x00, 0x00, { data: '1f02', le: 0x100 });
  if (!res.noError()) {
    printError(res.toError());
  } else {
    printBer(res.data, { template: fciTemplate });
  }

  console.log(' <= Response');
  res = await readEntireBinary(secureReader, { le: 0xdf });
  printBer(res, { noTail: true });

  console.log('= Select EF.CD: 1f03');
  res = await select(secureReader, 0x00, 0x00, { data: '1f03', le: 0x100 });
  if (!res.noError()) {
    printError(res.toError());
  } else {
    printBer(res.data, { template: fciTemplate });
  }

  console.log(' <= Response');
  res = await readEntireBinary(secureReader, { le: 0xdf });
  printBer(res, { noTail: true });

  console.log('= Select EF.AOD: 1f05');
  res = await select(secureReader, 0x00, 0x00, { data: '1f05', le: 0x100 });
  if (!res.noError()) {
    printError(res.toError());
  } else {
    printBer(res.data, { template: fciTemplate });
  }

  console.log(' <= Response');
  res = await readEntireBinary(secureReader, { le: 0xdf });
  printBer(res, { noTail: true });

  console.log('= Select Public Key "Signature Key 1 QES": 1f07');
  res = await select(secureReader, 0x00, 0x00, { data: '1f07', le: 0x100 });
  if (!res.noError()) {
    printError(res.toError());
  } else {
    printBer(res.data, { template: fciTemplate });
  }

  console.log(' <= Response');
  res = await readEntireBinary(secureReader, { le: 0xdf });
  printBer(res, { noTail: true });

  console.log('= Select Public Key "Signature Key 2": 1f0b');
  res = await select(secureReader, 0x00, 0x00, { data: '1f0b', le: 0x100 });
  if (!res.noError()) {
    printError(res.toError());
  } else {
    printBer(res.data, { template: fciTemplate });
  }

  console.log(' <= Response');
  res = await readEntireBinary(secureReader, { le: 0xdf });
  printBer(res, { noTail: true });

  console.log('= Select Certificate "Signature Key 1 QES": 1f06');
  res = await select(secureReader, 0x00, 0x00, { data: '1f06', le: 0x100 });
  if (!res.noError()) {
    printError(res.toError());
  } else {
    printBer(res.data, { template: fciTemplate });
  }

  console.log(' <= Response');
  res = await readBinary(secureReader, 0x00, 0x100);
  res = await readEntireBinary(secureReader, { le: 0xdf });
  printBer(res, { noTail: true });

  console.log('= Select Certificate "Signature Key 2": 1f0a');
  res = await select(secureReader, 0x00, 0x00, { data: '1f0a', le: 0x100 });
  if (!res.noError()) {
    printError(res.toError());
  } else {
    printBer(res.data, { template: fciTemplate });
  }

  console.log(' <= Response');
  res = await readEntireBinary(secureReader, { le: 0xdf });
  printBer(res, { noTail: true });
}

async function getChallenge(reader, le) {
  const apdu = new CommandApdu(0x00, 0x84, 0x00, 0x00, { le });
  console.log('GET CHALLENGE', apdu.toDebugString());
  return reader.transmit(apdu);
}
