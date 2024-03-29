/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
import dotenv from 'dotenv';
import SimpleReader from '../lib/simple_reader.mjs';
import SecureReader from '../lib/secure_reader.mjs';
import select from '../lib/iso7816/select.mjs';
import readFile from '../lib/read_file.mjs';
import CommandApdu from '../lib/iso7816/command_apdu.mjs';
import performPace from '../lib/doc9309/perform_pace.mjs';
import { main, printError } from './util.mjs';

dotenv.config();

main(work);
async function work(reader) {
  console.log(`= ATR: ${reader.atr.toString('hex')}`);

  const simpleReader = new SimpleReader(reader);

  await reader.connect({ share_mode: reader.reader.SCARD_SHARE_SHARED });

  await selectApplication(simpleReader, 'd61659903701524f4f5400', 'ROOT');
  const can = await readFile(simpleReader, { fileId: '0101', le: 0xff });
  console.log('CAN', can);

  const conf = [
    ['d6165990370143525950544f3100', 'CRYPTO1'],
    ['d6165990370143525950544f3100', 'CRYPTO1', mse],
    ['d616599037015349474e3100', 'SIGN1'],
    ['d616599037015349474e3100', 'SIGN1', mse],
  ];

  for (const [aid, label, func] of conf) {
    await selectApplication(simpleReader, aid, label);

    let rdr = simpleReader;
    let ret;

    if (typeof func === 'function') {
      console.log('= Perform PACE');
      const session = await performPace(simpleReader, {
        password: can,
        passwordType: 'id-RAW',
        reference: 'id-CAN',
        protocol: 'id-PACE-ECDH-GM-3DES-CBC-CBC',
        standardizedDomainParametersId: 12,
      });
      const secureReader = new SecureReader(reader, session);
      await mse(secureReader);
      rdr = secureReader;
    }

    for (let i = 0; i < 0xffff; i += 1) {
      const p1 = (i >> 8) & 0xff;
      const p2 = i & 0xff;
      const fileId = i.toString(16).padStart(4, '0');

      if (p2 === 0x00) {
        console.log(fileId);
      }

      ret = await getData(rdr, p1, p2);
      if (ret.noError()) {
        console.log(fileId, ret);
      }
    }
  }
}

async function mse(reader) {
  const apdu = new CommandApdu(0x00, 0x22, 0xf3, 0x01);
  console.log('MSE:RESTORE', apdu.toDebugString());
  return reader.transmit(apdu);
}

async function getData(reader, p1, p2) {
  const apdu = new CommandApdu(0x00, 0xca, p1, p2);
  return reader.transmit(apdu, 0xff);
}

async function selectApplication(reader, aid, label) {
  console.log('= Select Application:', aid, label);
  const res = await select(reader, 0x04, 0x0c, { data: aid });
  if (!res.noError()) {
    printError(res.toError());
  }
}
