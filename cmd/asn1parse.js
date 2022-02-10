/* eslint-disable no-console */
import { pipeline } from 'stream';
import minimist from 'minimist';
import { consoleLog, transform } from 'stream-util2';
import noTail from '../lib/asn1/util/no_tail.js';

import ParserStream from '../lib/asn1/ber/parser_stream.js';
import TreeStream from '../lib/asn1/tree/stream.js';
import TreeInspectStream from '../lib/asn1/tree/inspect_stream.js';
import TreeForcedParserStream from '../lib/asn1/tree/forced_parser_stream.js';

export default main;

function main(argv) {
  argv = minimist(
    argv.slice(1),
    {
      alias: {
        hex: ['h'],
        force: ['f'],
      },
    },
  );

  pipeline([
    process.stdin,
    argv.hex && transformify(toHex),
    new ParserStream(),
    new TreeStream(),
    argv.force && new TreeForcedParserStream(),
    argv.tail === false && transformify(noTail),
    new TreeInspectStream({ colors: true }),
    consoleLog(),
  ].filter(Boolean), (err) => {
    if (err) {
      console.error(err);
    }
  });
}

function toHex(buf) {
  return Buffer.from(buf.toString(), 'hex');
}

function transformify(fn) {
  return transform((chunk, done) => {
    try {
      done(null, fn(chunk));
    } catch (ex) {
      done(ex);
    }
  });
}
