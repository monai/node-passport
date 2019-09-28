const crypto = require('crypto');

module.exports = {
  dbak,
  computeKey,
};

function dbak(kmrz) {
  const sha1 = crypto.createHash('sha1');
  sha1.update(kmrz);
  const h = sha1.digest();
  const k = h.slice(0, 16);

  const c1 = Buffer.from([0, 0, 0, 1]);
  const c2 = Buffer.from([0, 0, 0, 2]);

  const dEnc = Buffer.concat([k, c1]);
  const dMac = Buffer.concat([k, c2]);

  const enc = computeKey(dEnc);
  const mac = computeKey(dMac);

  return [enc, mac];
}

function computeKey(d) {
  const sha1 = crypto.createHash('sha1');
  sha1.update(d);
  const h = sha1.digest();
  const ka = adjustParity(h.slice(0, 8));
  const kb = adjustParity(h.slice(8, 16));

  return Buffer.concat([ka, kb]);
}

function adjustParity(data) {
  const adjusted = [];
  for (const x of data) {
    const y = x & 0xfe;
    let parity = 0;
    for (let z = 0; z < 8; z++) {
      parity += y >> z & 1;
    }
    const s = y + (parity % 2 === 0 ? 1 : 0);
    adjusted.push(s);
  }

  return Buffer.from(adjusted);
}
