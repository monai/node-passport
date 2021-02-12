/* eslint-disable no-console */
const Reader = require('../lib/reader');
const SimpleReader = require('../lib/simpleReader');
const SecureReader = require('../lib/secureReader');
const select = require('../lib/iso7816/select');
const readBinary = require('../lib/iso7816/readBinary');
const getChallenge = require('../lib/iso7816/getChallenge');
const CommandApdu = require('../lib/iso7816/CommandApdu');
const ControlParameters = require('../lib/iso7816/ControlParameters');
const { assertSwOk, printResShort } = require('../lib/iso7816/util');
const performPace = require('../lib/doc9309/performPace');

main().then(console.log, console.error);

async function main() {
  const reader = new Reader();
  const simpleReader = new SimpleReader(reader);

  await reader.waitForCard();
  await reader.connect({ share_mode: reader.reader.SCARD_SHARE_SHARED });

  let res;
  let aid;
  let apdu;
  let data;

  // aid = ['e828bd080fd616599037014352595054'].join(''); // CIA_CRYPTO1
  // aid = ['e828bd080fd616599037015349474e31'].join(''); // CIA_SIGN1
  // aid = ['d6165990370143525950544f3100'].join(''); // CRYPTO1
  // aid = ['d616599037015349474e3100'].join(''); // SIGN1
  // console.log('select', aid, Buffer.from(aid, 'hex').toString());
  // res = await select(simpleReader, 0x04, 0x00, { data: aid, bl: 0xff });
  // assertSwOk(res);
  // printResShort(res);

  // res = await getChallenge(simpleReader, 0x00, { le: 8 });
  // console.log(res);

  // res = await select(simpleReader, 0x02, 0x04, { data: '2f00', bl: 0xff });
  // console.log(res);
  // printBer(res.data);
  // res = await select(simpleReader, 0x02, 0x04, { data: '5032', bl: 0xff });
  // console.log(res);
  // res = await select(simpleReader, 0x02, 0x04, { data: '5031', bl: 0xff });
  // console.log(res);

  // const cp1 = new ControlParameters(res.data);
  // res = await readBinary(simpleReader, 0, cp1.fileLength);
  // assertSwOk(res);
  // printBer(res.data);
  // console.log(res.data.toString('hex'));

  // return;

  // Get CAN base
  aid = ['D61659903701', '524f4f5400'].join('');
  console.log('select', aid, Buffer.from(aid, 'hex').toString());
  res = await select(simpleReader, 0x04, 0x00, { data: aid, bl: 0xff });
  assertSwOk(res);
  // printResShort(res);

  res = await select(simpleReader, 0x02, 0x04, { data: '0101', bl: 0xff });
  assertSwOk(res);

  const cp = new ControlParameters(res.data);
  res = await readBinary(simpleReader, 0, cp.fileLength);
  assertSwOk(res);
  const can = res.data;
  console.log('can', can);

  aid = ['d6165990370143525950544f3100'].join(''); // CRYPTO1
  // aid = ['d616599037015349474e3100'].join(''); // SIGN1
  console.log('select', aid, Buffer.from(aid, 'hex').toString());
  res = await select(simpleReader, 0x04, 0x00, { data: aid, bl: 0xff });
  assertSwOk(res);
  printResShort(res);

  const session = await performPace(simpleReader, { can });
  const secureReader = new SecureReader(reader, session);

  // apdu = new CommandApdu(0x00, 0x20, 0x00, 0x91);
  // console.log(apdu.toDebugString());
  // ret = await secureReader.transmit(apdu);
  // console.log(ret);
}
