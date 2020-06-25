/* eslint-disable no-shadow */
const t = require('tap');
const dbak = require('../dbak');

t.test('computeKey', (t) => {
  const kseed = '239AB9CB282DAF66231DC5A4DF6BFBAE';

  t.test('Compute encryption key (c = "00000001")', (t) => {
    const c = '00000001';
    const exptKa = 'AB94FDECF2674FDF';
    const exptKb = 'B9B391F85D7F76F2';

    const d = Buffer.from(kseed + c, 'hex');
    const key = dbak.computeKey(d);

    const ka = key.slice(0, 8);
    const kb = key.slice(8, 16);

    t.assert(ka.equals(Buffer.from(exptKa, 'hex')), 'Ka');
    t.assert(kb.equals(Buffer.from(exptKb, 'hex')), 'Kb');

    t.end();
  });

  t.test('Compute MAC computation key (c = "00000002")', (t) => {
    const c = '00000002';
    const exptKa = '7962D9ECE03D1ACD';
    const exptKb = '4C76089DCE131543';

    const d = Buffer.from(kseed + c, 'hex');
    const key = dbak.computeKey(d);

    const ka = key.slice(0, 8);
    const kb = key.slice(8, 16);

    t.assert(ka.equals(Buffer.from(exptKa, 'hex')), 'Ka');
    t.assert(kb.equals(Buffer.from(exptKb, 'hex')), 'Kb');

    t.end();
  });

  t.end();
});

t.test('computeDbaks', (t) => {
  t.test('Derivation of Document Basic Access Keys (Kenc and Kmac)', (t) => {
    const kmrz = 'L898902C<369080619406236';

    const exptEnc = 'AB94FDECF2674FDFB9B391F85D7F76F2';
    const exptMac = '7962D9ECE03D1ACD4C76089DCE131543';

    const [enc, mac] = dbak.computeDbaks(kmrz);

    t.assert(enc.equals(Buffer.from(exptEnc, 'hex')), 'Kenc');
    t.assert(mac.equals(Buffer.from(exptMac, 'hex')), 'Kmac');

    t.end();
  });

  t.end();
});
