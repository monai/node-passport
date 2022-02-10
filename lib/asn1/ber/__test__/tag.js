/* eslint-disable no-shadow */
import { test } from 'tap';
import { encode, decode, Tag } from '../tag.js';
import LengthError from '../../length_error.js';

test('tag', (t) => {
  t.test('encode', (t) => {
    t.test('class', (t) => {
      const klass = [0, 1, 2, 3];
      const expected = [0x00, 0x40, 0x80, 0xc0];

      klass.forEach((kls, i) => {
        t.test(`klass == ${kls}`, (t) => {
          const buf = encode(kls, 0, 0);

          t.equal(buf[0], expected[i], 'correct class');

          t.end();
        });
      });

      t.end();
    });

    t.test('encoding', (t) => {
      const encoding = [0, 1];
      const expected = [0x00, 0x20];

      encoding.forEach((enc, i) => {
        t.test(`encoding == ${enc}`, (t) => {
          const buf = encode(0, enc, 0);

          t.equal(buf[0], expected[i], 'correct encoding');

          t.end();
        });
      });

      t.end();
    });

    t.test('number', (t) => {
      const number = [
        [0, 0, 1],
        [0, 1, 2],
        [1, 0, 3],
        [1, 1, 4],
        [2, 0, 5],
        [2, 1, 6],
        [3, 0, 7],
        [3, 1, 8],
      ];
      const expected = [0x01, 0x22, 0x43, 0x64, 0x85, 0xa6, 0xc7, 0xe8];

      number.forEach((num, i) => {
        t.test(`number == ${num[2]}`, (t) => {
          const buf = encode(...num);

          t.equal(buf[0], expected[i], 'correct number');

          t.end();
        });
      });

      t.end();
    });

    t.test('number == 31', (t) => {
      const buf = encode(0, 0, 31);

      const expected = Buffer.from([0x1f, 0x1f]);

      t.ok(expected.equals(buf));

      t.end();
    });

    t.test('number overflows Number.MAX_SAFE_INTEGER', (t) => {
      t.throws(() => encode(0b11, 0b1, Number.MAX_SAFE_INTEGER + 1), RangeError, `expected to throw ${RangeError.name}`);

      t.end();
    });

    t.test('number == Number.MAX_SAFE_INTEGER', (t) => {
      const buf = encode(0b11, 0b1, Number.MAX_SAFE_INTEGER);

      const expected = Buffer.from([0xff, 0x8f, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x7f]);

      t.ok(expected.equals(buf));

      t.end();
    });

    t.test('force multibyte encoding', (t) => {
      const buf = encode(0, 0, 7, { multibyte: true });

      const expected = Buffer.from([0x1f, 0x07]);

      t.ok(expected.equals(buf));

      t.end();
    });

    t.end();
  });

  t.test('decode', (t) => {
    t.test(`returns instance of ${Tag.name}`, (t) => {
      const [tag] = decode(Buffer.from([0x00]));

      t.type(tag, Tag);

      t.end();
    });

    t.test('returns read length', (t) => {
      const [, rl] = decode(Buffer.from([0x00]));

      t.equal(rl, 1);

      t.end();
    });

    t.test('class', (t) => {
      const tags = [0x00, 0x40, 0x80, 0xc0];
      const expected = [0, 1, 2, 3];

      tags.forEach((tag, i) => {
        tag = Buffer.from([tag]);
        t.test(`tag 0x${tag.toString('hex')}`, (t) => {
          const [obj, rl] = decode(tag);

          t.equal(obj.klass, expected[i], 'correct class');
          t.equal(rl, 1, 'correct read length');

          t.end();
        });
      });

      t.end();
    });

    t.test('encoding', (t) => {
      const tags = [0x00, 0x20];
      const expected = [0, 1];

      tags.forEach((tag, i) => {
        tag = Buffer.from([tag]);
        t.test(`tag 0x${tag.toString('hex')}`, (t) => {
          const [obj, rl] = decode(tag);

          t.equal(obj.encoding, expected[i], 'correct encoding');
          t.equal(rl, 1, 'correct read length');

          t.end();
        });
      });

      t.end();
    });

    t.test('number', (t) => {
      const tags = [0x00, 0x20, 0x40, 0x60, 0x80, 0xa0, 0xc0, 0xe0];
      const expected = [1, 2, 3, 4, 5, 6, 7, 8];

      tags.forEach((tag, i) => {
        tag = Buffer.from([tag | expected[i]]);
        t.test(`tag 0x${tag.toString('hex')}`, (t) => {
          const [obj, rl] = decode(tag);

          t.equal(obj.number, expected[i], 'correct number');
          t.equal(rl, 1, 'correct read length');

          t.end();
        });
      });

      t.end();
    });

    t.test('multibyte identifier', (t) => {
      t.test('insufficient length', (t) => {
        const tag = Buffer.from([0xff, 0x8f, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]);

        t.throws(() => decode(tag), LengthError, `expected to throw ${LengthError.name}`);

        t.end();
      });

      t.test('number == Number.MAX_SAFE_INTEGER', (t) => {
        const tag = Buffer.from([0xff, 0x8f, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x7f]);

        const [obj, rl] = decode(tag);

        t.equal(obj.number, Number.MAX_SAFE_INTEGER, 'correct number');
        t.equal(rl, 9, 'correct read length');

        t.end();
      });

      t.test('tag 0x7f0e', (t) => {
        const tag = Buffer.from([0x7f, 0x0e]);

        const [obj, rl] = decode(tag);

        t.equal(obj.number, 0x0e, 'correct number');
        t.equal(rl, 2, 'correct read length');

        t.end();
      });

      t.end();
    });

    t.end();
  });

  t.end();
});
