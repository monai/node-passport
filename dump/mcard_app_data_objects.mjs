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
import efDirType from '../lib/pkcs15/types/ef_dir.mjs';
import privateKeyChoiceType from '../lib/pkcs15/types/private_key_choice.mjs';
import publicKeyChoiceType from '../lib/pkcs15/types/public_key_choice.mjs';
import certificateChoiceType from '../lib/pkcs15/types/certificate_choice.mjs';
import authenticationObjectChoiceType from '../lib/pkcs15/types/authentication_object_choice.mjs';
import cioChoice from '../lib/doc9309/templates/cio_choice.mjs';
import ciaInfoTemplate from '../lib/doc9309/templates/cia_info.mjs';
import securityInfosForPace from '../lib/doc9309/templates/security_infos_for_pace.mjs';
import subjectPublicKeyInfoType from '../lib/x509/types/subject_public_key_info.mjs';
import certificateType from '../lib/x509/types/certificate.mjs';
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
    printBer(res.data, { type: efDirType });
  }

  console.log('= Select EF.ATR/INFO: 2F01');
  res = await select(simpleReader, 0x00, 0x00, { data: '2F01', le: 0x100 });
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
    printBer(res.data, { type: efDirType });
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
  printBer(res, { template: ciaInfoTemplate, noTail: true });

  console.log('= Select EF.OD: 5031');
  res = await select(secureReader, 0x00, 0x00, { data: '5031', le: 0x100 });
  if (!res.noError()) {
    printError(res.toError());
  } else {
    printBer(res.data, { template: fciTemplate });
  }

  console.log(' <= Response');
  res = await readEntireBinary(secureReader, { le: 0xdf });
  printBer(res, { template: cioChoice, noTail: true });

  console.log('= Select EF.PrKD: 1f01');
  res = await select(secureReader, 0x00, 0x00, { data: '1f01', le: 0x100 });
  if (!res.noError()) {
    printError(res.toError());
  } else {
    printBer(res.data, { template: fciTemplate });
  }

  console.log(' <= Response');
  res = await readEntireBinary(secureReader, { le: 0xdf });
  printBer(res, { type: privateKeyChoiceType, noTail: true });

  console.log('= Select EF.PuKD: 1f02');
  res = await select(secureReader, 0x00, 0x00, { data: '1f02', le: 0x100 });
  if (!res.noError()) {
    printError(res.toError());
  } else {
    printBer(res.data, { template: fciTemplate });
  }

  console.log(' <= Response');
  res = await readEntireBinary(secureReader, { le: 0xdf });
  printBer(res, { type: publicKeyChoiceType, noTail: true });

  console.log('= Select EF.CD: 1f03');
  res = await select(secureReader, 0x00, 0x00, { data: '1f03', le: 0x100 });
  if (!res.noError()) {
    printError(res.toError());
  } else {
    printBer(res.data, { template: fciTemplate });
  }

  console.log(' <= Response');
  res = await readEntireBinary(secureReader, { le: 0xdf });
  printBer(res, { type: certificateChoiceType, noTail: true });

  console.log('= Select EF.AOD: 1f05');
  res = await select(secureReader, 0x00, 0x00, { data: '1f05', le: 0x100 });
  if (!res.noError()) {
    printError(res.toError());
  } else {
    printBer(res.data, { template: fciTemplate });
  }

  console.log(' <= Response');
  res = await readEntireBinary(secureReader, { le: 0xdf });
  printBer(res, { type: authenticationObjectChoiceType, noTail: true });

  console.log('= Select Public Key "Signature Key 1 QES": 1f07');
  res = await select(secureReader, 0x00, 0x00, { data: '1f07', le: 0x100 });
  if (!res.noError()) {
    printError(res.toError());
  } else {
    printBer(res.data, { template: fciTemplate });
  }

  console.log(' <= Response');
  res = await readEntireBinary(secureReader, { le: 0xdf });
  printBer(res, { type: { children: [subjectPublicKeyInfoType] }, noTail: true });

  console.log('= Select Public Key "Signature Key 2": 1f0b');
  res = await select(secureReader, 0x00, 0x00, { data: '1f0b', le: 0x100 });
  if (!res.noError()) {
    printError(res.toError());
  } else {
    printBer(res.data, { template: fciTemplate });
  }

  console.log(' <= Response');
  res = await readEntireBinary(secureReader, { le: 0xdf });
  printBer(res, { type: { children: [subjectPublicKeyInfoType] }, noTail: true });

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
  printBer(res, { type: { children: [certificateType] }, noTail: true });

  console.log('= Select Certificate "Signature Key 2": 1f0a');
  res = await select(secureReader, 0x00, 0x00, { data: '1f0a', le: 0x100 });
  if (!res.noError()) {
    printError(res.toError());
  } else {
    printBer(res.data, { template: fciTemplate });
  }

  console.log(' <= Response');
  res = await readEntireBinary(secureReader, { le: 0xdf });
  printBer(res, { type: { children: [certificateType] }, noTail: true });

  console.log('= Select ICAO EF.DG14: 1f14');
  res = await select(secureReader, 0x00, 0x00, { data: '1f14', le: 0x100 });
  if (!res.noError()) {
    printError(res.toError());
  } else {
    printBer(res.data, { template: fciTemplate });
  }

  console.log(' <= Response');
  res = await readEntireBinary(secureReader, { le: 0xdf });
  console.log(res.toString('hex'));
  printBer(res, { noForce: true, noTail: true });

  console.log('= Select File: df01');
  res = await select(secureReader, 0x08, 0x00, { data: 'df01', le: 0x100 });
  if (!res.noError()) {
    printError(res.toError());
  } else {
    printBer(res.data, { template: fciTemplate });
  }

  console.log('= Select ICAO EF.DG1: 0101');
  res = await select(secureReader, 0x00, 0x00, { data: '0101', le: 0x100 });
  if (!res.noError()) {
    printError(res.toError());
  } else {
    printBer(res.data, { template: fciTemplate });
  }

  console.log(' <= Response');
  res = await readEntireBinary(secureReader, { le: 0xdf });
  printBer(res, { noTail: true });

  console.log('= Select ICAO EF.DG2: 0102');
  res = await select(secureReader, 0x00, 0x00, { data: '0102', le: 0x100 });
  if (!res.noError()) {
    printError(res.toError());
  } else {
    printBer(res.data, { template: fciTemplate });
  }

  console.log(' <= Response');
  res = await readEntireBinary(secureReader, { le: 0xdf });
  printBer(res, { noTail: true });

  console.log('= Select ICAO EF.DG11: 010B');
  res = await select(secureReader, 0x00, 0x00, { data: '010B', le: 0x100 });
  if (!res.noError()) {
    printError(res.toError());
  } else {
    printBer(res.data, { template: fciTemplate });
  }

  console.log(' <= Response');
  res = await readEntireBinary(secureReader, { le: 0xdf });
  printBer(res, { noTail: true });

  console.log('= Select ICAO EF.DG14: 010E');
  res = await select(secureReader, 0x00, 0x00, { data: '010E', le: 0x100 });
  if (!res.noError()) {
    printError(res.toError());
  } else {
    printBer(res.data, { template: fciTemplate });
  }

  console.log(' <= Response');
  res = await readEntireBinary(secureReader, { le: 0xdf });
  printBer(res, { noForce: true, noTail: true });

  console.log('= Select ICAO EF.SOD: 011D');
  res = await select(secureReader, 0x00, 0x00, { data: '011D', le: 0x100 });
  if (!res.noError()) {
    printError(res.toError());
  } else {
    printBer(res.data, { template: fciTemplate });
  }

  console.log(' <= Response');
  res = await readEntireBinary(secureReader, { le: 0xdf });
  printBer(res, { noForce: true, noTail: true });
}

async function getChallenge(reader, le) {
  const apdu = new CommandApdu(0x00, 0x84, 0x00, 0x00, { le });
  console.log('GET CHALLENGE', apdu.toDebugString());
  return reader.transmit(apdu);
}
