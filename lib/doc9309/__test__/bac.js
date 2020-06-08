const t = require('tap');
const bac = require('../bac');

t.test('Authentication and establishment of session keys', t => {
  const [kEnc, kMac, rndIc, rndIfd, kIfd, eIfd, mIfd] = [
    'AB94FDECF2674FDFB9B391F85D7F76F2',
    '7962D9ECE03D1ACD4C76089DCE131543',
    '4608F91988702212',
    '781723860C06C226',
    '0B795240CB7049B01C19B33E32804F0B',
    '72C29C2371CC9BDB65B779B8E8D37B29ECC154AA56A8799FAE2F498F76ED92F2',
    '5F1448EEA8AD90A7',
  ].map(s => Buffer.from(s, 'hex'));

  t.test('computeEifd', t => {
    const s = Buffer.concat([rndIfd, rndIc, kIfd]);

    const _eIfd = bac.computeEifd(kEnc, s);

    t.assert(_eIfd.equals(eIfd), 'eIfd');

    t.end();
  });

  t.test('computeKeysIfd', t => {
    const keysIfd = bac.computeKeysIfd([kEnc, kMac], rndIc, rndIfd, kIfd);

    [[eIfd, 'eIfd'], [mIfd, 'mIfd']].forEach(([key, name], i) => {
      t.assert(keysIfd[i].equals(key), name);
    });

    t.end();
  });

  t.end();
});
