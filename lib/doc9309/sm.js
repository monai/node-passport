const CommandApdu = require('../iso7816/CommandApdu');
const ResponseApdu = require('../iso7816/ResponseApdu');
const { buildDo87, buildDo8e, buildDo97 } = require('../iso7816/sm');
const { pad, unpad } = require('../iso9797');
const parse = require('../asn1/parse');

module.exports = {
  protect,
  unprotect,
};

function protect(session, apdu) {
  const cmdHeader = maskClassAndPad(apdu);
  let do87 = Buffer.alloc(0);
  let do97 = Buffer.alloc(0);

  if (apdu.data) {
    do87 = buildDo87(0x01, session.encrypt(pad(apdu.data)));
  }

  if (apdu.le) {
    do97 = buildDo97(Buffer.from([apdu.le]));
  }

  const M = Buffer.concat([cmdHeader, do87, do97]);
  session.increment();
  const N = pad(Buffer.concat([session.ssc, M]));
  const CC = session.mac(N);
  const do8e = buildDo8e(CC);

  const data = Buffer.concat([do87, do97, do8e]);

  return new CommandApdu(
    cmdHeader[0],
    cmdHeader[1],
    cmdHeader[2],
    cmdHeader[3],
    {
      data,
      le: 0,
      sm97: CommandApdu.shortSm97,
    },
  );
}

function unprotect(session, rapdu) {
  const tags = parse(rapdu.data).reduce((acc, tag) => {
    acc[tag.tag.identifier] = tag;
    return acc;
  }, {});
  const { 0x87: do87, 0x99: do99, 0x8e: do8e } = tags;

  if (do8e) {
    const CC = do8e.contents;

    session.increment();
    const K = pad(Buffer.concat([session.ssc, do87 && do87.data, do99.data].filter(Boolean)));
    const CCb = session.mac(K);

    if (!CC.equals(CCb)) {
      throw new Error('Ivalid checksum for response APDU');
    }
  }

  const data = do87 ? unpad(session.decrypt(do87.contents.slice(1))) : Buffer.alloc(0);
  return new ResponseApdu(data, do99.contents);
}

function maskClassAndPad(apdu) {
  return pad(Buffer.from([
    0x0c,
    apdu.ins,
    apdu.p1,
    apdu.p2,
  ]));
}
