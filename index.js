const Reader = require('./lib/reader');
const selectApplication = require('./lib/doc9309/selectApplication');
const { performBac } = require('./lib/doc9309/bac');
const { dbak } = require('./lib/doc9309/dbak');
const { readFileSF } = require('./lib/doc9309/readFile');
const SecureReader = require('./lib/secureReader');

const kmrz = process.env.KMRZ;
if ( ! kmrz) {
  throw 'Environment variable KMRZ is not defined';
}

work();
async function work() {
  const reader = new Reader();

  try {
    await reader.waitForCard();
    await reader.connect();

    await selectApplication(reader);
    const session = await performBac(reader, dbak(kmrz));
    const sreader = new SecureReader(reader, session);

    const file = await readFileSF(sreader, '011e');
    console.log(file);
  } catch (ex) {
    console.error(ex);
  }
}
