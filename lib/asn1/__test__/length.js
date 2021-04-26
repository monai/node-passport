/* eslint-disable no-shadow */
const t = require('tap');
const Asn1Error = require('../asn1_error');
const LengthError = require('../length_error');
const { encode, decode } = require('../length');

t.test('length', (t) => {
  t.test('encode', (t) => {
    t.test('length == 0x7f', (t) => {
      const length = encode(0x7f);
      const buffer = Buffer.from([0x7f]);

      t.ok(buffer.equals(length), 'correct encoding');

      t.end();
    });

    t.test('length == 0x80', (t) => {
      const length = encode(0x80);
      const buffer = Buffer.from([0x81, 0x80]);

      t.ok(buffer.equals(length), 'correct encoding');

      t.end();
    });

    t.test('length == 0xff', (t) => {
      const length = encode(0xff);
      const buffer = Buffer.from([0x81, 0xff]);

      t.ok(buffer.equals(length), 'correct encoding');

      t.end();
    });

    t.test('length == 0xffffffff', (t) => {
      const length = encode(0xffffffff);
      const buffer = Buffer.from([0x84, 0xff, 0xff, 0xff, 0xff]);

      t.ok(buffer.equals(length), 'correct encoding');

      t.end();
    });

    t.test('length == Number.MAX_SAFE_INTEGER', (t) => {
      const length = encode(Number.MAX_SAFE_INTEGER);
      const buffer = Buffer.from([0x87, 0x1f, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]);

      t.ok(buffer.equals(length), 'correct encoding');

      t.end();
    });

    t.test('length overflows Number.MAX_SAFE_INTEGER', (t) => {
      t.throws(() => encode(Number.MAX_SAFE_INTEGER + 1), RangeError, `expected to throw ${RangeError.name}`);

      t.end();
    });

    t.end();
  });

  t.test('decode', (t) => {
    t.test('invalid length 0xff', (t) => {
      const buffer = Buffer.from([0xff]);
      t.throws(() => decode(buffer), Asn1Error, `expected to throw ${Asn1Error.name}`);

      t.end();
    });

    t.test('length == 0x7f', (t) => {
      const buffer = Buffer.from([0x7f]);
      const [length, rl] = decode(buffer);

      t.equal(length, 0x7f, 'correct length');
      t.equal(rl, 1, 'correct read length');

      t.end();
    });

    t.test('length == 0x80', (t) => {
      const buffer = Buffer.from([0x80]);
      const [length, rl] = decode(buffer);

      t.equal(length, Infinity, 'correct length');
      t.equal(rl, 1, 'correct read length');

      t.end();
    });

    t.test('too short data length', (t) => {
      const buffer = Buffer.from([0x83, 0x01, 0x02]);
      t.throws(() => decode(buffer), LengthError, `expected to throw ${LengthError.name}`);

      t.end();
    });

    t.test('length overflows Number.MAX_SAFE_INTEGER', (t) => {
      const buffer = Buffer.from([0x87, 0x20, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
      t.throws(() => decode(buffer), RangeError, `expected to throw ${RangeError.name}`);

      t.end();
    });

    t.test('length is Number.MAX_SAFE_INTEGER', (t) => {
      const buffer = Buffer.from([0x87, 0x1f, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]);
      const [length, rl] = decode(buffer);

      t.equal(length, Number.MAX_SAFE_INTEGER, 'correct length');
      t.equal(rl, 8, 'correct read length');

      t.end();
    });

    t.end();
  });

  t.end();
});
