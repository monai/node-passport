/* eslint-disable no-shadow */
const t = require('tap');
const Asn1Error = require('../Asn1Error');
const LengthError = require('../LengthError');
const { encode, decode } = require('../length');

t.test('length', (t) => {
  t.test('encode', (t) => {
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
