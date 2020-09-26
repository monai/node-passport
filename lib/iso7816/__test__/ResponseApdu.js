/* eslint-disable no-shadow */
const t = require('tap');
const ResponseApdu = require('../ResponseApdu');

t.test('ResponseApdu', (t) => {
  const buffer0 = Buffer.alloc(0);
  const buffer01 = Buffer.from([0x01]);
  const buffer02 = Buffer.from([0x02]);
  const buffer03 = Buffer.from([0x03]);
  const buffer04 = Buffer.from([0x04]);
  const buffer0102 = Buffer.concat([buffer01, buffer02]);
  const buffer0304 = Buffer.concat([buffer03, buffer04]);

  t.test('constructor', (t) => {
    t.test('no arguments', (t) => {
      t.doesNotThrow(() => new ResponseApdu());

      t.end();
    });

    t.test('data is Buffer[0], sw1 is Buffer[2], sw2 is undefined', (t) => {
      const apdu = new ResponseApdu(buffer0, buffer0102);

      t.equals(apdu.data.length, 0, 'data is correct length');
      t.ok(apdu.sw.equals(buffer0102), 'sw is correct');
      t.ok(apdu.sw1.equals(buffer01), 'sw1 is correct');
      t.ok(apdu.sw2.equals(buffer02), 'sw2 is correct');

      t.end();
    });

    t.test('data is Buffer[0], sw1 is Buffer[1], sw2 is Buffer[1]', (t) => {
      const apdu = new ResponseApdu(buffer0, buffer01, buffer02);

      t.equals(apdu.data.length, 0, 'data is correct length');
      t.ok(apdu.sw.equals(buffer0102), 'sw is correct');
      t.ok(apdu.sw1.equals(buffer01), 'sw1 is correct');
      t.ok(apdu.sw2.equals(buffer02), 'sw2 is correct');

      t.end();
    });

    t.test('data is Buffer[0], sw1 is number between 0xff and 0xffff, sw2 is undefined', (t) => {
      const apdu = new ResponseApdu(buffer0, 0x0304);

      t.equals(apdu.data.length, 0, 'data is correct length');
      t.ok(apdu.sw.equals(buffer0304), 'sw is correct');
      t.ok(apdu.sw1.equals(buffer03), 'sw1 is correct');
      t.ok(apdu.sw2.equals(buffer04), 'sw2 is correct');

      t.end();
    });

    t.test('data is Buffer[0], sw1 is number, sw2 is number', (t) => {
      const apdu = new ResponseApdu(buffer0, 0x01, 0x02);

      t.equals(apdu.data.length, 0, 'data is correct length');
      t.ok(apdu.sw.equals(buffer0102), 'sw is correct');
      t.ok(apdu.sw1.equals(buffer01), 'sw1 is correct');
      t.ok(apdu.sw2.equals(buffer02), 'sw2 is correct');

      t.end();
    });

    t.test('data is Buffer[0], sw1 is undefined, sw2 is undefined', (t) => {
      t.throws(() => new ResponseApdu(buffer0), RangeError, 'throws RangeError');

      t.end();
    });

    t.test('data is Buffer[1], sw1 is undefined, sw2 is undefined', (t) => {
      t.throws(() => new ResponseApdu(Buffer.alloc(1)), RangeError, 'throws RangeError');

      t.end();
    });

    t.test('data is Buffer[2], sw1 is undefined, sw2 is undefined', (t) => {
      const apdu = new ResponseApdu(buffer0102);

      t.equals(apdu.data.length, 0, 'data is correct length');
      t.ok(apdu.sw.equals(buffer0102), 'sw is correct');
      t.ok(apdu.sw1.equals(buffer01), 'sw1 is correct');
      t.ok(apdu.sw2.equals(buffer02), 'sw2 is correct');

      t.end();
    });

    t.test('data is Buffer[2], sw1 is Buffer[2], sw2 is undefined', (t) => {
      const apdu = new ResponseApdu(buffer0102, buffer0304);

      t.equals(apdu.data.length, 2, 'data is correct length');
      t.ok(apdu.data.equals(buffer0102), 'data is correct');
      t.ok(apdu.sw.equals(buffer0304), 'sw is correct');
      t.ok(apdu.sw1.equals(buffer03), 'sw1 is correct');
      t.ok(apdu.sw2.equals(buffer04), 'sw2 is correct');

      t.end();
    });

    t.test('data is Buffer[2], sw1 is Buffer[1], sw2 is Buffer[1]', (t) => {
      const apdu = new ResponseApdu(buffer0102, buffer03, buffer04);

      t.equals(apdu.data.length, 2, 'data is correct length');
      t.ok(apdu.data.equals(buffer0102), 'data is correct');
      t.ok(apdu.sw.equals(buffer0304), 'sw is correct');
      t.ok(apdu.sw1.equals(buffer03), 'sw1 is correct');
      t.ok(apdu.sw2.equals(buffer04), 'sw2 is correct');

      t.end();
    });

    t.end();
  });

  t.test('toBuffer', (t) => {
    t.test('data is Buffer[0], sw is present', (t) => {
      const apdu = new ResponseApdu(buffer0, buffer01, buffer02);
      const buffer = apdu.toBuffer();

      t.type(buffer, Buffer);
      t.equals(buffer.length, 2, 'data is correct length');

      t.end();
    });

    t.test('data is Buffer[5], sw is present', (t) => {
      const data = Buffer.alloc(5);
      const expectedData = Buffer.concat([data, buffer01, buffer02]);

      const apdu = new ResponseApdu(data, buffer01, buffer02);
      const buffer = apdu.toBuffer();

      t.type(buffer, Buffer);
      t.equals(buffer.length, 7, 'data is correct length');
      t.ok(buffer.equals(expectedData), 'data is corect');
      t.ok(buffer.slice(-2, -1).equals(buffer01), 'sw1 is correct');
      t.ok(buffer.slice(-1).equals(buffer02), 'sw2 is correct');

      t.end();
    });

    t.end();
  });

  t.test('noError', (t) => {
    t.test('sw is 0x9000', (t) => {
      const apdu = new ResponseApdu(Buffer.from([0x90, 0x00]));

      t.ok(apdu.noError());

      t.end();
    });

    t.test('sw is not 0x9000', (t) => {
      const apdu = new ResponseApdu(Buffer.from([0x90, 0x01]));

      t.notOk(apdu.noError());

      t.end();
    });

    t.end();
  });

  t.end();
});
