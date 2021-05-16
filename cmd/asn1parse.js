/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
/* eslint-disable no-console */
const { resolve } = require('path');
const { pipeline } = require('stream');
const minimist = require('minimist');
const stream = require('stream-util2');
const noTail = require('../lib/asn1/util/no_tail');

const ParserStream = require('../lib/asn1/parser_stream');
const TreeStream = require('../lib/asn1/tree_stream');
const TreeInspectStream = require('../lib/asn1/tree_inspect_stream');
const TreeForcedParserStream = require('../lib/asn1/tree_forced_parser_stream');

module.exports = main;

function main(argv) {
  argv = minimist(
    argv.slice(1),
    {
      alias: {
        hex: ['h'],
        type: ['t'],
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
    new TreeInspectStream({
      colors: true,
      type: type(argv.type),
    }),
    stream.consoleLog(),
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
  return stream.transform((chunk, done) => {
    try {
      done(null, fn(chunk));
    } catch (ex) {
      done(ex);
    }
  });
}

function type(arg) {
  return Object.assign(
    {},
    ...(Array.isArray(arg) ? arg : [arg])
      .filter(Boolean)
      .map((path) => require(resolve(process.cwd(), path))),
  );
}
