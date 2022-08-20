/* eslint-disable no-console */
import { pipeline, Transform } from 'stream';
import minimist from 'minimist';
import { consoleLog } from 'stream-util2';

import ParserStream from '../lib/asn1/ber/parser_stream.mjs';
import TreeStream from '../lib/asn1/tree/stream.mjs';
import TreeInspectStream from '../lib/asn1/tree/inspect_stream.mjs';
import TreeForcedParserStream from '../lib/asn1/tree/forced_parser_stream.mjs';

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
    argv.hex && transform(fromHex),
    new ParserStream(),
    new TreeStream(),
    argv.force && new TreeForcedParserStream(),
    argv.tail === false && transform((node) => node.trimEnd(), true),
    new TreeInspectStream({ colors: true }),
    consoleLog(),
  ].filter(Boolean), (err) => {
    if (err) {
      console.error(err);
    }
  });
}

function fromHex(buf) {
  return Buffer.from(buf.toString(), 'hex');
}

function transform(fn, objectMode) {
  return new Transform({
    objectMode,
    transform(chunk, _, done) {
      done(null, fn(chunk));
    },
  });
}
