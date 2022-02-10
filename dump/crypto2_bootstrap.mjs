/* eslint-disable no-console */
import Reader from '../lib/reader.mjs';
import SimpleReader from '../lib/simple_reader.mjs';
import select from '../lib/iso7816/select.mjs';
import readBinary from '../lib/iso7816/read_binary.mjs';
import { printBer } from '../lib/util.mjs';
import { printResOrError, printResShort } from '../lib/iso7816/util.mjs';

main();
async function main() {
  const reader = new Reader();
  reader.once('state', (state) => {
    if (state === 'present') {
      work(reader).catch(console.error);
    }
  });
}

async function work(reader) {
  const simpleReader = new SimpleReader(reader);

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
  buffer.push(res.data);

  console.log('read binary l:0x74');
  res = await readBinary(simpleReader, 0x058c, 0x74);
  buffer.push(res.data);

  printBer(Buffer.concat(buffer));

  console.log('select 5400');
  res = await select(simpleReader, 0x02, 0x04, { data: '5400', bl: 0xff });
  printResOrError(res);

  buffer = [];
  console.log('read binary l:0x058c');
  res = await readBinary(simpleReader, 0, 0x058c);
  buffer.push(res.data);

  console.log('read binary l:0x74');
  res = await readBinary(simpleReader, 0x058c, 0x74);
  buffer.push(res.data);

  printBer(Buffer.concat(buffer));

  console.log('select 5600');
  res = await select(simpleReader, 0x02, 0x04, { data: '5600', bl: 0xff });
  printResOrError(res);

  buffer = [];
  console.log('read binary l:0x058c');
  res = await readBinary(simpleReader, 0, 0x058c);
  buffer.push(res.data);

  console.log('read binary l:0x74');
  res = await readBinary(simpleReader, 0x058c, 0x74);
  buffer.push(res.data);

  printBer(Buffer.concat(buffer));

  console.log('select 5701');
  res = await select(simpleReader, 0x02, 0x04, { data: '5701', bl: 0xff });
  printResOrError(res);

  buffer = [];
  console.log('read binary l:0x058c');
  res = await readBinary(simpleReader, 0, 0x058c);
  buffer.push(res.data);

  console.log('read binary l:0x058c');
  res = await readBinary(simpleReader, 0x058c, 0x058c);
  buffer.push(res.data);

  console.log('read binary l:0x058c');
  res = await readBinary(simpleReader, 0x0b18, 0x013b);
  buffer.push(res.data);

  printBer(Buffer.concat(buffer));
}
