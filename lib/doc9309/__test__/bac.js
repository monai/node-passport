/* eslint-disable no-shadow */
import { test } from 'tap';
import {
  computeBacKeys, computeEifd, computeKeysIfd, computeSessionKeys, computeSsc,
} from '../bac.js';
import { kdf, adjustParity } from '../kdf.js';

test('Doc 9309-11 Appendix D', (t) => {
  t.test('D.1 Compute Keys From Key Seed (Kseed)', (t) => {
    const kSeed = '239AB9CB282DAF66231DC5A4DF6BFBAE';

    t.test('Compute encryption key (c = "00000001")', (t) => {
      const exptKa = 'AB94FDECF2674FDF';
      const exptKb = 'B9B391F85D7F76F2';

      const k = Buffer.from(kSeed, 'hex');
      const key = kdf(k, 1, 'des-ede3-cbc');

      const ka = adjustParity(key.slice(0, 8));
      const kb = adjustParity(key.slice(8, 16));

      t.ok(ka.equals(Buffer.from(exptKa, 'hex')), 'Ka');
      t.ok(kb.equals(Buffer.from(exptKb, 'hex')), 'Kb');

      t.end();
    });

    t.test('Compute MAC computation key (c = "00000002")', (t) => {
      const exptKa = '7962D9ECE03D1ACD';
      const exptKb = '4C76089DCE131543';

      const k = Buffer.from(kSeed, 'hex');
      const key = kdf(k, 2, 'des-ede3-cbc');

      const ka = adjustParity(key.slice(0, 8));
      const kb = adjustParity(key.slice(8, 16));

      t.ok(ka.equals(Buffer.from(exptKa, 'hex')), 'Ka');
      t.ok(kb.equals(Buffer.from(exptKb, 'hex')), 'Kb');

      t.end();
    });

    t.end();
  });

  t.test('D.2 Derivation of Document Basic Access Keys (Kenc and Kmac)', (t) => {
    const mrzInfo = 'L898902C<369080619406236';

    const exptEnc = 'AB94FDECF2674FDFB9B391F85D7F76F2';
    const exptMac = '7962D9ECE03D1ACD4C76089DCE131543';

    const [kEnc, kMac] = computeBacKeys(mrzInfo);

    const kEncAdj = adjustParity(kEnc);
    const kMacAdj = adjustParity(kMac);

    t.ok(kEncAdj.equals(Buffer.from(exptEnc, 'hex')), 'Kenc');
    t.ok(kMacAdj.equals(Buffer.from(exptMac, 'hex')), 'Kmac');

    t.end();
  });

  t.test('D.3 Authentication And Establishment of Session Keys', (t) => {
    const [kEnc, kMac, rndIc, rndIfd, kIfd, eIfd, mIfd, keysIc, ksEnc, ksMac, ssc] = [
      'AB94FDECF2674FDFB9B391F85D7F76F2',
      '7962D9ECE03D1ACD4C76089DCE131543',
      '4608F91988702212',
      '781723860C06C226',
      '0B795240CB7049B01C19B33E32804F0B',
      '72C29C2371CC9BDB65B779B8E8D37B29ECC154AA56A8799FAE2F498F76ED92F2',
      '5F1448EEA8AD90A7',
      '46B9342A41396CD7386BF5803104D7CEDC122B9132139BAF2EEDC94EE178534F2F2D235D074D7449',
      '979EC13B1CBFE9DCD01AB0FED307EAE5',
      'F1CB1F1FB5ADF208806B89DC579DC1F8',
      '887022120C06C226',
    ].map((s) => Buffer.from(s, 'hex'));

    t.test('computeEifd', (t) => {
      const s = Buffer.concat([rndIfd, rndIc, kIfd]);

      const computedEifd = computeEifd(kEnc, s);

      t.ok(computedEifd.equals(eIfd), 'eIfd');

      t.end();
    });

    t.test('computeKeysIfd', (t) => {
      const keysIfd = computeKeysIfd([kEnc, kMac], rndIc, rndIfd, kIfd);

      [[eIfd, 'eIfd'], [mIfd, 'mIfd']].forEach(([key, name], i) => {
        t.ok(keysIfd[i].equals(key), name);
      });

      t.end();
    });

    t.test('computeSessionKeys', (t) => {
      const sessionKeys = computeSessionKeys({
        rndIfd, kIfd, rndIc, keys: [kEnc], keysIc,
      });

      const ksEncAdj = adjustParity(sessionKeys[0]);
      const ksMacAdj = adjustParity(sessionKeys[1]);

      t.ok(ksEnc.equals(ksEncAdj), 'ksEnc');
      t.ok(ksMac.equals(ksMacAdj), 'ksMac');

      t.end();
    });

    t.test('computeSsc', (t) => {
      const computedSsc = computeSsc({ rndIfd, rndIc });

      t.ok(ssc.equals(computedSsc), 'ssc');

      t.end();
    });

    t.end();
  });

  t.end();
});
