/* eslint-disable no-console */
/* eslint-disable no-throw-literal */
const Reader = require('../lib/reader');
const select = require('../lib/iso7816/select');
const performBac = require('../lib/doc9309/performBac');
const { computeBacKeys } = require('../lib/doc9309/bac');
const { readFile } = require('../lib/readFile');
const SimpleReader = require('../lib/simpleReader');
const SecureReader = require('../lib/secureReader');
const parse = require('../lib/asn1/parse');
const inspect = require('../lib/asn1/inspect');

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

    await select(simpleReader, 0x04, 0x0c, 'A0000002471001');

    const session = await performBac(reader, computeBacKeys(kmrz));
    const sreader = new SecureReader(reader, session);

    const res = await readFile({ reader: sreader, sfi: 0x01 });
    const tree = parse(res);

    console.log(inspect(tree, { colors: true }));
  } catch (ex) {
    console.error(ex);
  }
}
