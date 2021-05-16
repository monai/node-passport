/* eslint-disable no-console */
/* eslint-disable no-throw-literal */
const Reader = require('../lib/reader');
const select = require('../lib/iso7816/select');
const performBac = require('../lib/doc9309/perform_bac');
const { computeBacKeys } = require('../lib/doc9309/bac');
const readFile = require('../lib/read_file');
const SimpleReader = require('../lib/simple_reader');
const SecureReader = require('../lib/secure_reader');
const parse = require('../lib/asn1/util/parse');
const inspect = require('../lib/asn1/tree_inspect');

require('dotenv').config();

const kmrz = process.env.KMRZ;
if (!kmrz) {
  throw 'Environment variable KMRZ is not defined';
}

work();
async function work() {
  const reader = new Reader();
  const simpleReader = new SimpleReader(reader);

  try {
    await reader.waitForCard();
    await reader.connect({ share_mode: reader.reader.SCARD_SHARE_SHARED });

    await select(simpleReader, 0x04, 0x0c, { data: 'A0000002471001' });

    const session = await performBac(reader, computeBacKeys(kmrz));
    const sreader = new SecureReader(reader, session);

    const res = await readFile(sreader, { shortFileId: 0x01, le: 0xff });
    const tree = parse(res);

    console.log(inspect(tree, { colors: true }));
  } catch (ex) {
    console.error(ex);
  }
}
