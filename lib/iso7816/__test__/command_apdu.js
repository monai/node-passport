/* eslint-disable no-shadow */
const t = require('tap');
const CommandApdu = require('../command_apdu');

t.test('CommandApdu', (t) => {
  const args = [0x01, 0x02, 0x03, 0x04];

  t.test('constructor', (t) => {
    t.test('no arguments', (t) => {
      t.doesNotThrow(() => new CommandApdu());
      t.end();
    });

    t.test('only positional arguments', (t) => {
      const apdu = new CommandApdu(...args);
      // eslint-disable-next-line object-curly-newline
      const { cla, ins, p1, p2 } = apdu;

      t.equal(cla, args[0], 'correct property cla');
      t.equal(ins, args[1], 'correct property ins');
      t.equal(p1, args[2], 'correct property p1');
      t.equal(p2, args[3], 'correct property p1');

      t.end();
    });

    t.test('data is string', (t) => {
      const data = '0001020304aaff';
      const apdu = new CommandApdu(...args, { data });

      const expected = Buffer.from(data, 'hex');
      t.ok(() => apdu.data.equals(expected), 'correct property data');

      t.end();
    });

    t.test('data is Buffer', (t) => {
      const data = Buffer.from('0001020304aaff', 'hex');
      const apdu = new CommandApdu(...args, { data });

      t.ok(() => apdu.data.equals(data), 'correct property data');

      t.end();
    });

    t.test('data length is > 0xffff', (t) => {
      const data = Buffer.alloc(0x10000);

      t.throws(() => new CommandApdu(...args, { data }), RangeError);

      t.end();
    });

    t.test('le is < 0x10000', (t) => {
      const le = 0x05;
      const apdu = new CommandApdu(...args, { le });

      t.equal(apdu.le, le, 'correct property le');

      t.end();
    });

    t.test('le is > 0x10000', (t) => {
      const le = 0x10001;

      t.throws(() => new CommandApdu(...args, { le }), RangeError);

      t.end();
    });

    t.end();
  });

  t.test('toBuffer', (t) => {
    t.test('no data and no Le', (t) => {
      const buffer = new CommandApdu(...args).toBuffer();

      t.ok(buffer.equals(Buffer.from(args)), 'correct buffer');

      t.end();
    });

    t.test('data length is 0xff and no Le', (t) => {
      const data = Buffer.alloc(0xff);
      const buffer = new CommandApdu(...args, { data }).toBuffer();

      t.equal(buffer.length, 4 + 1 + data.length, 'Lc field is short');
      t.equal(buffer[4], 0xff, 'Lc is equal to 0xff');
      t.ok(buffer.slice(5).equals(data), 'data field is correct');

      t.end();
    });

    t.test('data length is 0x100 and no Le', (t) => {
      const data = Buffer.alloc(0x100);
      const buffer = new CommandApdu(...args, { data }).toBuffer();

      t.equal(buffer.length, 4 + 3 + data.length, 'Lc field is extended');
      t.equal(buffer[4], 0x00, 'Lc byte 1 is equal to 0x00');
      t.equal(buffer[5], 0x01, 'Lc byte 2 is equal to 0x01');
      t.equal(buffer[6], 0x00, 'Lc byte 3 is equal to 0x00');
      t.ok(buffer.slice(7).equals(data), 'data field is correct');

      t.end();
    });

    t.test('no data and Le is 0xff', (t) => {
      const le = 0xff;
      const buffer = new CommandApdu(...args, { le }).toBuffer();

      t.equal(buffer.length, 4 + 1, 'Le field is short');
      t.equal(buffer[4], le, 'Le is equal to 0xff');

      t.end();
    });

    t.test('no data and Le is 0x100', (t) => {
      const le = 0xff;
      const buffer = new CommandApdu(...args, { le }).toBuffer();

      t.equal(buffer.length, 4 + 1, 'Le field is short');
      t.equal(buffer[4], le, 'Le is equal to 0x00');

      t.end();
    });

    t.test('no data and Le is 0x101', (t) => {
      const le = 0x101;
      const buffer = new CommandApdu(...args, { le }).toBuffer();

      t.equal(buffer.length, 4 + 3, 'Le field is extended 3 bytes long');
      t.equal(buffer[4], 0x00, 'Le byte 1 is equal to 0x00');
      t.equal(buffer[5], 0x01, 'Le byte 2 is equal to 0x01');
      t.equal(buffer[6], 0x01, 'Le byte 3 is equal to 0x01');

      t.end();
    });

    t.test('data length is 0xff and Le is 0xff', (t) => {
      const data = Buffer.alloc(0xff);
      const le = 0xff;
      const buffer = new CommandApdu(...args, { data, le }).toBuffer();
      const leValue = buffer.slice(-1);

      t.equal(buffer.length, 4 + 1 + data.length + 1, 'Le field is short');
      t.equal(leValue[0], 0xff, 'Le is equal to 0xff');

      t.end();
    });

    t.test('data length is 0xff and Le is 0x100', (t) => {
      const data = Buffer.alloc(0xff);
      const le = 0x100;
      const buffer = new CommandApdu(...args, { data, le }).toBuffer();
      const leValue = buffer.slice(-1);

      t.equal(buffer.length, 4 + 1 + data.length + 1, 'Le field is short');
      t.equal(leValue[0], 0x00, 'Le is equal to 0x00');

      t.end();
    });

    t.test('data length is 0x100 and Le is 0x100', (t) => {
      const data = Buffer.alloc(0x100);
      const le = 0x100;
      const buffer = new CommandApdu(...args, { data, le }).toBuffer();
      const leValue = buffer.slice(-1);

      t.equal(buffer.length, 4 + 3 + data.length + 2, 'Le field is extended');
      t.equal(leValue[0], 0x00, 'Le is equal to 0x00');

      t.end();
    });

    t.test('data length is 0xff and Le is 0x101', (t) => {
      const data = Buffer.alloc(0xff);
      const le = 0x101;
      const buffer = new CommandApdu(...args, { data, le }).toBuffer();
      const leValue = buffer.slice(-3);

      t.equal(buffer.length, 4 + 3 + data.length + 2, 'Le is extended 3 byte long');
      t.equal(leValue[0], 0x00, 'Le byte 1 is equal to 0x00');
      t.equal(leValue[1], 0x01, 'Le byte 2 is equal to 0x01');
      t.equal(leValue[2], 0x01, 'Le byte 3 is equal to 0x01');

      t.end();
    });

    t.test('data length is 0x100 and Le is 0x101', (t) => {
      const data = Buffer.alloc(0x100);
      const le = 0x101;
      const buffer = new CommandApdu(...args, { data, le }).toBuffer();
      const leValue = buffer.slice(-2);

      t.equal(buffer.length, 4 + 3 + data.length + 2, 'Le is extended 2 byte long');
      t.equal(leValue[0], 0x01, 'Le byte 2 is equal to 0x01');
      t.equal(leValue[1], 0x01, 'Le byte 3 is equal to 0x01');

      t.end();
    });

    t.test('data length is 0xff and Le is 0x10000', (t) => {
      const data = Buffer.alloc(0xff);
      const le = 0x10000;
      const buffer = new CommandApdu(...args, { data, le }).toBuffer();
      const leValue = buffer.slice(-2);

      t.equal(buffer.length, 4 + 3 + data.length + 2, 'Le is extended 2 byte long');
      t.equal(leValue[0], 0x00, 'Le byte 1 is equal to 0x00');
      t.equal(leValue[1], 0x00, 'Le byte 2 is equal to 0x00');

      t.end();
    });

    t.test('data length is 0x100 and Le is 0x10000', (t) => {
      const data = Buffer.alloc(0x100);
      const le = 0x10000;
      const buffer = new CommandApdu(...args, { data, le }).toBuffer();
      const leValue = buffer.slice(-2);

      t.equal(buffer.length, 4 + 3 + data.length + 2, 'Le is extended 2 byte long');
      t.equal(leValue[0], 0x00, 'Le byte 2 is equal to 0x00');
      t.equal(leValue[1], 0x00, 'Le byte 3 is equal to 0x00');

      t.end();
    });

    t.end();
  });

  t.end();
});
