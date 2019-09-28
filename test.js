const { dbak } = require('./lib/doc9309/dbak');
const { authentication } = require('./lib/doc9309/bac');
const { mac } = require('./lib/iso9797');

const mrzk = 'L898902C<369080619406236';
console.log('mrzk:', mrzk);

const keys = dbak(mrzk);
const [kEnc, kMac] = keys;
console.log('kEnc:', kEnc.toString('hex'));
console.log('kMac:', kMac.toString('hex'));
console.log('---');

const rndIc = Buffer.from('4608F91988702212', 'hex');
const rndIfd = Buffer.from('781723860C06C226', 'hex');
const kIfd = Buffer.from('0B795240CB7049B01C19B33E32804F0B', 'hex');

const authKeys = authentication(keys, rndIc, rndIfd, kIfd);
const [eIfd, mIfd] = authKeys;
console.log('eIfd:', eIfd.length, eIfd.toString('hex'));
console.log('mIfd:', mIfd.length, mIfd.toString('hex'));
console.log('---');
