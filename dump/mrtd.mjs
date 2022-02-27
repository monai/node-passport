/* eslint-disable no-console */
import { inspect } from 'util';
import dotenv from 'dotenv';
import select from '../lib/iso7816/select.mjs';
import performBac from '../lib/doc9309/perform_bac.mjs';
import { computeBacKeys } from '../lib/doc9309/bac.mjs';
import readFile from '../lib/read_file.mjs';
import SimpleReader from '../lib/simple_reader.mjs';
import SecureReader from '../lib/secure_reader.mjs';
import parse from '../lib/asn1/util/parse.mjs';
import { main, printError } from './util.mjs';

dotenv.config();

const kmrz = process.env.KMRZ;
if (!kmrz) {
  throw new Error('Environment variable KMRZ is not defined');
}

main(work);
async function work(reader) {
  console.log(`= ATR: ${reader.atr.toString('hex')}`);

  const simpleReader = new SimpleReader(reader);
  let res;

  await reader.connect({ share_mode: reader.reader.SCARD_SHARE_SHARED });

  console.log('= Select MF: 3F00');
  res = await select(simpleReader, 0x02, 0x04, { data: '3F00' });
  if (!res.noError()) {
    printError(res.toError());
  }

  const aid = 'A0000002471001';
  console.log('= Select Application:', aid);
  res = await select(simpleReader, 0x04, 0x0c, { data: aid });
  if (!res.noError()) {
    printError(res.toError());
  }

  console.log('= Perform BAC');
  const session = await performBac(reader, computeBacKeys(kmrz));
  const secureReader = new SecureReader(reader, session);

  const files = [
    '011E',
    '0101',
    '0102',
    '0103',
    '0104',
    '0105',
    '0106',
    '0107',
    '0108',
    '0109',
    '010A',
    '010B',
    '010C',
    '010D',
    '010E',
    '010F',
    '0110',
    '011D',
  ];

  for (const file of files) {
    console.log('= Read file:', file);
    try {
      // eslint-disable-next-line no-await-in-loop
      res = await readFile(secureReader, { fileId: file, le: 0xef });

      const tree = parse(res);
      console.log(inspect(tree, { colors: true }));
    } catch (ex) {
      printError(ex);
    }
  }

  reader.close();
}
