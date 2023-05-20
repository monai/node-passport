/* eslint-disable no-shadow */
import { test } from 'tap';
import ResponseApdu from '../response_apdu.mjs';

test('ResponseApdu', (t) => {
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

    t.test('sw1 and sw2 are not numbers', (t) => {
      t.throws(() => new ResponseApdu('a', Symbol('b')));

      t.end();
    });

    t.test('only sw1', (t) => {
      const apdu = new ResponseApdu(0x01);

      t.hasStrict(apdu, { data: undefined }, 'data is correct');
      t.equal(apdu.sw, 0x0100, 'sw is correct');
      t.equal(apdu.sw1, 0x01, 'sw1 is correct');
      t.equal(apdu.sw2, 0x00, 'sw2 is correct');

      t.end();
    });

    t.test('sw1 and sw2 are numbers', (t) => {
      const apdu = new ResponseApdu(0x01, 0x02);

      t.hasStrict(apdu, { data: undefined }, 'data is correct');
      t.equal(apdu.sw, 0x0102, 'sw is correct');
      t.equal(apdu.sw1, 0x01, 'sw1 is correct');
      t.equal(apdu.sw2, 0x02, 'sw2 is correct');

      t.end();
    });

    t.test('sw1 and sw2 are numbers, data is Buffer', (t) => {
      const apdu = new ResponseApdu(0x01, 0x02, buffer0);

      t.hasStrict(apdu, { data: buffer0 }, 'data is correct');
      t.equal(apdu.sw, 0x0102, 'sw is correct');
      t.equal(apdu.sw1, 0x01, 'sw1 is correct');
      t.equal(apdu.sw2, 0x02, 'sw2 is correct');

      t.end();
    });

    t.test('sw1 and sw2 are big numbers', (t) => {
      const apdu = new ResponseApdu(0x0101, 0x0102);

      t.hasStrict(apdu, { data: undefined }, 'data is correct');
      t.equal(apdu.sw, 0x0102, 'sw is correct');
      t.equal(apdu.sw1, 0x01, 'sw1 is correct');
      t.equal(apdu.sw2, 0x02, 'sw2 is correct');

      t.end();
    });

    t.end();
  });

  t.test('fromBuffer', (t) => {
    t.test('Buffer length is zero', (t) => {
      t.throws(() => ResponseApdu.fromBuffer(buffer0));

      t.end();
    });

    t.test('Buffer length is one', (t) => {
      t.throws(() => ResponseApdu.fromBuffer(buffer01));

      t.end();
    });

    t.test('Buffer length is two', (t) => {
      const apdu = ResponseApdu.fromBuffer(buffer0102);

      t.hasStrict(apdu, { data: buffer0 }, 'data is correct');
      t.equal(apdu.sw, 0x0102, 'sw is correct');
      t.equal(apdu.sw1, 0x01, 'sw1 is correct');
      t.equal(apdu.sw2, 0x02, 'sw2 is correct');

      t.end();
    });

    t.test('Buffer length is four', (t) => {
      const apdu = ResponseApdu.fromBuffer(Buffer.concat([buffer0304, buffer0102]));

      t.hasStrict(apdu, { data: buffer0304 }, 'data is correct');
      t.equal(apdu.sw, 0x0102, 'sw is correct');
      t.equal(apdu.sw1, 0x01, 'sw1 is correct');
      t.equal(apdu.sw2, 0x02, 'sw2 is correct');

      t.end();
    });

    t.end();
  });

  t.test('toBuffer', (t) => {
    t.test('data is Buffer[0], sw is present', (t) => {
      const apdu = new ResponseApdu(buffer01, buffer02, buffer0);
      const buffer = apdu.toBuffer();

      t.type(buffer, Buffer);
      t.equal(buffer.length, 2, 'data is correct length');

      t.end();
    });

    t.test('data is Buffer[5], sw is present', (t) => {
      const data = Buffer.alloc(5);
      const expectedData = Buffer.concat([data, buffer01, buffer02]);

      const apdu = new ResponseApdu(0x01, 0x02, data);
      const buffer = apdu.toBuffer();

      t.type(buffer, Buffer);
      t.equal(buffer.length, 7, 'data is correct length');
      t.ok(buffer.equals(expectedData), 'data is corect');
      t.ok(buffer.subarray(-2, -1).equals(buffer01), 'sw1 is correct');
      t.ok(buffer.subarray(-1).equals(buffer02), 'sw2 is correct');

      t.end();
    });

    t.end();
  });

  t.test('noError', (t) => {
    t.test('sw is 0x9000', (t) => {
      const apdu = new ResponseApdu(0x90, 0x00);

      t.ok(apdu.noError());

      t.end();
    });

    t.test('sw is 0x9100', (t) => {
      const apdu = new ResponseApdu(0x91, 0x00);

      t.ok(apdu.noError());

      t.end();
    });

    t.test('sw is 0x9fff', (t) => {
      const apdu = new ResponseApdu(0x9f, 0xff);

      t.ok(apdu.noError());

      t.end();
    });

    t.end();
  });

  t.end();
});
