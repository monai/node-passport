/* eslint-disable no-console */
const crypto = require('crypto');
const Reader = require('../lib/reader');
const SimpleReader = require('../lib/simple_reader');
const SecureReader = require('../lib/secure_reader');
const readFile = require('../lib/read_file');
const CommandApdu = require('../lib/iso7816/command_apdu');
const performPace = require('../lib/doc9309/perform_pace');
const { selectApplication } = require('./util');

require('dotenv').config();

main();
async function main() {
  const reader = new Reader();
  reader.once('state', (state) => {
    if (state === 'present') {
      work(reader)
        .catch((error) => console.error('main error', error))
        .finally(() => {
          reader.close();
        });
    }
  });
}

async function work(reader) {
  console.log(`= ATR: ${reader.atr.toString('hex')}`);

  const simpleReader = new SimpleReader(reader);

  await reader.connect({ share_mode: reader.reader.SCARD_SHARE_SHARED });

  await selectApplication(simpleReader, 'd61659903701524f4f5400', 'ROOT');
  const can = await readFile(simpleReader, { fileId: '0101', le: 0xff });
  console.log('CAN', can);

  await selectApplication(simpleReader, 'd616599037015349474e3100', 'SIGN1');

  console.log('= Perform PACE');
  const session = await performPace(simpleReader, { can });
  const secureReader = new SecureReader(reader, session);

  let apdu;
  let ret;

  apdu = new CommandApdu(0x00, 0x22, 0xf3, 0x01);
  console.log('MSE:RESTORE', apdu.toDebugString());
  ret = await secureReader.transmit(apdu);
  console.log(ret);

  // apdu = new CommandApdu(0x00, 0xca, 0x5f, 0x01);
  // console.log('GET DATA', apdu.toDebugString());
  // ret = await secureReader.transmit(apdu);
  // console.log(ret);

  apdu = new CommandApdu(0x00, 0x20, 0x00, 0x81, { data: Buffer.from(process.env.PIN) });
  console.log('VERIFY', apdu.toDebugString());
  ret = await secureReader.transmit(apdu);
  console.log(ret);

  const data = 'alio';
  const hash = Buffer.alloc(256);
  crypto.createHash('sha256').update(data).digest().copy(hash, 256 - 32);

  apdu = new CommandApdu(0x00, 0x2a, 0x9e, 0x9a, { data: hash });
  console.log('PSO', apdu.toDebugString());
  ret = await secureReader.transmit(apdu, 0xffff);
  console.log(ret);
}
