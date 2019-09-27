const crypto = require('crypto');
const { mac, pad } = require('../iso9797');

module.exports = {
  authentication
};

function authentication(challenge, rnd, key, done) {
  const [kEnc, kMac] = key;
  const rndIfd = rnd.slice(0, 8);
  const kIfd = rnd.slice(8, 24);
  const s = Buffer.concat([rndIfd, challenge, kIfd]);

  const eIfd = computeEifd(kEnc, s);
  const mIfd = mac(kMac, pad(eIfd));

  return [eIfd, mIfd];
}

function computeEifd(kEnc, s) {
  const iv = Buffer.alloc(8);
  const key = Buffer.concat([kEnc, kEnc.slice(0, 8)]);

  const cipher = crypto.createCipheriv('des-ede3-cbc', key, iv);
  return cipher.update(s);
}
}
