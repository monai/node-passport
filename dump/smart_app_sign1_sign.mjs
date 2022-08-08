/* eslint-disable prefer-const */
/* eslint-disable no-console */
import dotenv from 'dotenv';
import { createHash } from 'crypto';
import SimpleReader from '../lib/simple_reader.mjs';
import SecureReader from '../lib/secure_reader.mjs';
import readFile from '../lib/read_file.mjs';
import CommandApdu from '../lib/iso7816/command_apdu.mjs';
import performPace from '../lib/doc9309/perform_pace.mjs';
import {
  main, selectApplication, mseRestore, verify, printResOrError,
} from './util.mjs';

dotenv.config();

main(work);
async function work(reader) {
  console.log(`= ATR: ${reader.atr.toString('hex')}`);

  const simpleReader = new SimpleReader(reader);

  await reader.connect({ share_mode: reader.reader.SCARD_SHARE_SHARED });

  await selectApplication(simpleReader, 'd61659903701524f4f5400', 'ROOT');
  const can = await readFile(simpleReader, { fileId: '0101', le: 0xff });
  console.log('CAN', can.toString('hex'));

  await selectApplication(simpleReader, 'd616599037015349474e3100', 'SIGN1');

  console.log('= Perform PACE');
  const session = await performPace(simpleReader, {
    password: can,
    passwordType: 'id-RAW',
    reference: 'id-CAN',
    protocol: 'id-PACE-ECDH-GM-3DES-CBC-CBC',
    standardizedDomainParameter: 12,
  });
  const secureReader = new SecureReader(reader, session);

  await mseRestore(secureReader, 0x01);
  await verify(secureReader, Buffer.from(process.env.LITEID_2012_PIN));

  let apdu;
  let res;

  // apdu = new CommandApdu(0x00, 0xca, 0x5f, 0x01);
  // console.log('GET DATA', apdu.toDebugString());
  // res = await secureReader.transmit(apdu);
  // printResOrError(res);

  const data = 'alio';
  const hash = Buffer.alloc(256);
  createHash('sha256').update(data).digest().copy(hash, 256 - 32);

  apdu = new CommandApdu(0x00, 0x2a, 0x9e, 0x9a, { data: hash });
  console.log('PSO', apdu.toDebugString());
  res = await secureReader.transmit(apdu, 0xffff);
  printResOrError(res);
}
