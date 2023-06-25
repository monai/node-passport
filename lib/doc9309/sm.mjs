/* eslint-disable max-len */
// Doc 9303
// Machine Readable Travel Documents
// Seventh Edition, 2015
// Part 11: Security Mechanisms for MRTDs

import CommandApdu from '../iso7816/command_apdu.mjs';
import ResponseApdu from '../iso7816/response_apdu.mjs';
import { buildDo87, buildDo8e, buildDo97 } from '../iso7816/sm.mjs';
import parse from '../asn1/util/parse.mjs';

const buf00 = Buffer.alloc(1);
const buf0000 = Buffer.alloc(2);

export function protectCommandApdu(session, capdu, options = {}) {
  let do87 = Buffer.alloc(0);
  let do97 = Buffer.alloc(0);

  session.incrementSSC();

  if (capdu.data) {
    do87 = buildDo87(0x01, session.encrypt(session.addPadding(capdu.data)));
  } else if (options.forceDo87) {
    // 9.8.4 Message Structure of SM APDUs
    // Figure 4 shows the transformation of an unprotected command APDU to a protected command APDU in the case *Data*
    // and *Le* are available. If no *Data* is available, leave building DO ‘87’ out. If *Le* is not available, leave building DO ‘97’ out.
    // To avoid ambiguity it is RECOMMENDED not to use an empty value field of Le Data Object (see also Section 10.4 of
    // [ISO/IEC 7816-4]).
    do87 = Buffer.from([0x87, 0x00]);
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

  const contents = do87?.contents && session.removePadding(session.decrypt(do87.contents.slice(1)));

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
  return ResponseApdu.fromBuffer(Buffer.concat([data, do99.contents].filter(Boolean)));
}

function unwrap(data) {
  return parse(data).node.children.reduce((acc, node) => {
    acc[node.tag.identifier] = node;
    return acc;
  }, {});
}
