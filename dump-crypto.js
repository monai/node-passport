/* eslint-disable no-console */
const Reader = require('./lib/reader');
const SimpleReader = require('./lib/simpleReader');
const parse = require('./lib/asn1/parse');
const inspect = require('./lib/asn1/inspect');
const select = require('./lib/iso7816/select');
const readBinary = require('./lib/iso7816/readBinary');
const { Iso7816Error } = require('./lib/iso7816/error');

work();
async function work() {
  const reader = new Reader();
  const simpleReader = new SimpleReader(reader);

  try {
    await reader.waitForCard();
    await reader.connect({ share_mode: reader.reader.SCARD_SHARE_SHARED });

    // CIAInfo 5032 12
    // OD      5031 11

    // E828BD080F - 7816
    // D61659903701 - D national
    // 5349474E31 SIGN1 - iso
    // 4352595054 CRYPT - pix

    // E828BD080F D61659903701 4352595054

    let res;
    let aid;

    res = await select(simpleReader, 0x02, 0x04, { data: '5032', bl: 0xff });
    printResOrError(res);

    aid = ['E828BD080F', 'D61659903701', '4352595054'].join('');
    console.log('select', aid, Buffer.from(aid, 'hex').toString());
    res = await select(simpleReader, 0x04, 0x00, { data: aid, bl: 0xff });
    printResShort(res);

    console.log('select 5032');
    res = await select(simpleReader, 0x02, 0x04, { data: '5032', bl: 0xff });
    printResOrError(res);

    console.log('read binary l:0x93');
    res = await readBinary(simpleReader, 0, 0x93);
    printResOrError(res);

    console.log('select 0101');
    res = await select(simpleReader, 0x02, 0x04, { data: '0101', bl: 0xff });
    printResOrError(res);

    aid = ['D61659903701', '524f4f5400'].join('');
    console.log('select', aid, Buffer.from(aid, 'hex').toString());
    res = await select(simpleReader, 0x04, 0x00, { data: aid, bl: 0xff });
    printResShort(res);

    console.log('select 0101');
    res = await select(simpleReader, 0x02, 0x04, { data: '0101', bl: 0xff });
    printResOrError(res);

    console.log('read binary l:0x08');
    res = await readBinary(simpleReader, 0, 0x08);
    printResShort(res);

    console.log('select 5300');
    res = await select(simpleReader, 0x02, 0x04, { data: '5300', bl: 0xff });
    printResOrError(res);

    aid = ['D61659903701', '43525950544f3100'].join('');
    console.log('select', aid, Buffer.from(aid, 'hex').toString());
    res = await select(simpleReader, 0x04, 0x00, { data: aid, bl: 0xff });
    printResShort(res);

    console.log('select 5300');
    res = await select(simpleReader, 0x02, 0x04, { data: '5300', bl: 0xff });
    printResOrError(res);

    console.log('read binary l:0x01');
    res = await readBinary(simpleReader, 0, 0x01);
    printResShort(res);

    console.log('select 5300');
    res = await select(simpleReader, 0x02, 0x04, { data: '5300', bl: 0xff });
    printResOrError(res);

    // 0x058c - magic
    console.log('read binary l:0x058c');
    res = await readBinary(simpleReader, 0, 0x058c);
    printResOrError(res);

    console.log('read binary l:0x74');
    res = await readBinary(simpleReader, 0x058c, 0x74);
    printResOrError(res);

    console.log('select 5400');
    res = await select(simpleReader, 0x02, 0x04, { data: '5400', bl: 0xff });
    printResOrError(res);

    console.log('read binary l:0x058c');
    res = await readBinary(simpleReader, 0, 0x058c);
    printResOrError(res);

    console.log('read binary l:0x74');
    res = await readBinary(simpleReader, 0x058c, 0x74);
    printResOrError(res);

    console.log('select 5600');
    res = await select(simpleReader, 0x02, 0x04, { data: '5600', bl: 0xff });
    printResOrError(res);

    console.log('read binary l:0x058c');
    res = await readBinary(simpleReader, 0, 0x058c);
    printResOrError(res);

    console.log('read binary l:0x74');
    res = await readBinary(simpleReader, 0x058c, 0x74);
    printResOrError(res);

    console.log('select 5701');
    res = await select(simpleReader, 0x02, 0x04, { data: '5701', bl: 0xff });
    printResOrError(res);

    console.log('read binary l:0x058c');
    res = await readBinary(simpleReader, 0, 0x058c);
    printResOrError(res);

    console.log('read binary l:0x058c');
    res = await readBinary(simpleReader, 0x058c, 0x058c);
    printResOrError(res);

    console.log('read binary l:0x058c');
    res = await readBinary(simpleReader, 0xb18, 0x013b);
    printResOrError(res);
  } catch (ex) {
    console.error(ex);
  }
}

function printRes(res) {
  const tree = parse(res.toBuffer());
  console.log(inspect(tree, { depth: 20, colors: true }));
}

function printResOrError(res) {
  if (res.noError()) {
    printRes(res);
  } else {
    console.log(new Iso7816Error(res.sw));
  }
  console.log('\n');
}

function printResShort(res) {
  console.log(`${res.sw.toString('hex')} ${res.toBuffer().inspect()}\n`);
}
