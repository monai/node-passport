import CommandApdu from '../iso7816/command_apdu.mjs';
import ResponseApdu from '../iso7816/response_apdu.mjs';
import { buildDo87, buildDo8e, buildDo97 } from '../iso7816/sm.mjs';
import parse from '../asn1/util/parse.mjs';

const buf00 = Buffer.alloc(1);
const buf0000 = Buffer.alloc(2);

export function protectCommandApdu(session, capdu) {
  let do87 = Buffer.alloc(0);
  let do97 = Buffer.alloc(0);

  session.incrementSSC();

  if (capdu.data) {
    do87 = buildDo87(0x01, session.encrypt(session.addPadding(capdu.data)));
  }

  if (capdu.le) {
    do97 = buildDo97(Buffer.from([capdu.le]));
  }

  const cmdHeader = capdu.getEncodedHeader();
  cmdHeader[0] |= 0x0c;

  const M = session.addPadding(Buffer.concat([
    session.addPadding(cmdHeader),
    do87,
    do97,
  ]));
  const CC = session.authenticate(M);
  const do8e = buildDo8e(CC);

  const data = Buffer.concat([do87, do97, do8e]);

  return new CommandApdu(...cmdHeader, { data, le: 0 });
}

export function unprotectCommandApdu(session, capdu) {
  const data = unwrap(capdu.data);
  const { 0x87: do87, 0x97: do97, 0x8e: do8e } = data;

  const cmdHeader = capdu.getEncodedHeader();

  if (do8e) {
    const CC = do8e.contents;

    const M = session.addPadding(Buffer.concat([
      session.addPadding(cmdHeader),
      do87?.data,
      do97?.data,
    ].filter(Boolean)));
    session.incrementSSC();
    if (!session.verify(M, CC)) {
      throw new Error('Ivalid checksum for response APDU');
    }
  }

  const contents = do87 && session.removePadding(session.decrypt(do87.contents.slice(1)));

  let le;
  if (do97) {
    if (do97.contents.equals(buf00)) {
      le = 0x100;
    } else if (do97.contents.equals(buf0000)) {
      le = 0x10000;
    } else {
      le = do97.contents.readUIntBE(0, do97.contents.length);
    }
  }

  return new CommandApdu(
    // 7816-4 5.4.1
    // Bit b8 set to 1 indicates the proprietary class, except for the value 'FF'
    // which is invalid due to specifications in ISO/IEC 7816-3.
    // The application-context defines the other bits of CLA in proprietary class.
    cmdHeader[0] & 0x80 ? cmdHeader[0] : 0x00,
    ...cmdHeader.slice(1, 4),
    {
      ...(contents && { data: contents }),
      ...(le && { le }),
    },
  );
}

export function unprotectResponseApdu(session, rapdu) {
  if (!rapdu.data) {
    return new ResponseApdu(rapdu.sw1, rapdu.sw2);
  }

  const { 0x87: do87, 0x99: do99, 0x8e: do8e } = unwrap(rapdu.data);

  if (do8e) {
    const CC = do8e.contents;

    session.incrementSSC();
    const K = session.addPadding(Buffer.concat([
      do87?.data,
      do99.data,
    ].filter(Boolean)));
    if (!session.verify(K, CC)) {
      throw new Error('Ivalid checksum for response APDU');
    }
  }

  const data = do87 && session.removePadding(session.decrypt(do87.contents.slice(1)));
  return ResponseApdu.fromBuffer(Buffer.concat([data, do99.contents]));
}

function unwrap(data) {
  return parse(data).node.children.reduce((acc, node) => {
    acc[node.tag.identifier] = node;
    return acc;
  }, {});
}
