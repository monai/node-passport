/* eslint-disable no-console */
const Reader = require('../lib/reader');
const SimpleReader = require('../lib/simpleReader');
const select = require('../lib/iso7816/select');
const readBinary = require('../lib/iso7816/readBinary');
const { printBer } = require('../lib/util');
const { printResOrError, printResShort } = require('../lib/iso7816/util');

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
    // 524f4f5400 ROOT\x00
    // 43525950544f3100 CRYPTO1\x00

    // E828BD080F D61659903701 4352595054

    let res;
    let aid;
    let buffer;

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

    // CAN
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
    buffer = [];
    console.log('read binary l:0x058c');
    res = await readBinary(simpleReader, 0, 0x058c);
    buffer.push(res.toBuffer());

    console.log('read binary l:0x74');
    res = await readBinary(simpleReader, 0x058c, 0x74);
    buffer.push(res.toBuffer());

    printBer(Buffer.concat(buffer));

    console.log('select 5400');
    res = await select(simpleReader, 0x02, 0x04, { data: '5400', bl: 0xff });
    printResOrError(res);

    buffer = [];
    console.log('read binary l:0x058c');
    res = await readBinary(simpleReader, 0, 0x058c);
    buffer.push(res.toBuffer());

    console.log('read binary l:0x74');
    res = await readBinary(simpleReader, 0x058c, 0x74);
    buffer.push(res.toBuffer());

    printBer(Buffer.concat(buffer));

    console.log('select 5600');
    res = await select(simpleReader, 0x02, 0x04, { data: '5600', bl: 0xff });
    printResOrError(res);

    buffer = [];
    console.log('read binary l:0x058c');
    res = await readBinary(simpleReader, 0, 0x058c);
    buffer.push(res.toBuffer());

    console.log('read binary l:0x74');
    res = await readBinary(simpleReader, 0x058c, 0x74);
    buffer.push(res.toBuffer());

    printBer(Buffer.concat(buffer));

    console.log('select 5701');
    res = await select(simpleReader, 0x02, 0x04, { data: '5701', bl: 0xff });
    printResOrError(res);

    buffer = [];
    console.log('read binary l:0x058c');
    res = await readBinary(simpleReader, 0, 0x058c);
    buffer.push(res.toBuffer());

    console.log('read binary l:0x058c');
    res = await readBinary(simpleReader, 0x058c, 0x058c);
    buffer.push(res.toBuffer());

    console.log('read binary l:0x058c');
    res = await readBinary(simpleReader, 0x0b18, 0x013b);
    buffer.push(res.toBuffer());

    printBer(Buffer.concat(buffer));
  } catch (ex) {
    console.error(ex);
  }
}
