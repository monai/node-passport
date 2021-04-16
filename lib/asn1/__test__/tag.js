/* eslint-disable no-shadow */
const t = require('tap');
const { decode, Tag } = require('../tag');
const LengthError = require('../LengthError');

t.test('tag', (t) => {
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

      t.test('Number.MAX_SAFE_INTEGER number', (t) => {
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
