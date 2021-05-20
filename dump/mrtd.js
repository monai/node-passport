/* eslint-disable no-console */
const Reader = require('../lib/reader');
const select = require('../lib/iso7816/select');
const performBac = require('../lib/doc9309/perform_bac');
const { computeBacKeys } = require('../lib/doc9309/bac');
const readFile = require('../lib/read_file');
const SimpleReader = require('../lib/simple_reader');
const SecureReader = require('../lib/secure_reader');
const parse = require('../lib/asn1/util/parse');
const inspect = require('../lib/asn1/tree_inspect');
const Iso7816Error = require('../lib/iso7816/iso7816_error');

require('dotenv').config();

const kmrz = process.env.KMRZ;
if (!kmrz) {
  throw new Error('Environment variable KMRZ is not defined');
}

main();
async function main() {
  const reader = new Reader();
  reader.once('state', (state) => {
    if (state === 'present') {
      work(reader).catch((error) => console.error('main error', error));
    }
  });
}

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

function printError(error) {
  if (error instanceof Iso7816Error) {
    console.error(`${error.tag} ${error.message}`);
  } else {
    console.error(error);
  }
}
