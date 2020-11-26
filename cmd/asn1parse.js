/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
/* eslint-disable no-console */
const { resolve } = require('path');
const minimist = require('minimist');
const stream = require('stream-util2');
const parse = require('../lib/asn1/parse');
const inspect = require('../lib/asn1/inspect');

module.exports = main;

function main(argv) {
  argv = minimist(
    argv.slice(1),
    {
      alias: {
        hex: ['h'],
        type: ['t'],
      },
    },
  );

  process
    .stdin
    .pipe(stream.buffer())
    .pipe(stream.writable((chunk, done) => {
      if (argv.hex) {
        chunk = Buffer.from(chunk.toString(), 'hex');
      }

      console.log(
        inspect(
          parse(chunk),
          {
            depth: 20,
            colors: true,
            type: type(argv.type),
          },
        ),
      );

      done();
    }));
}

function type(arg) {
  return Object.assign(
    {},
    ...(Array.isArray(arg) ? arg : [arg])
      .filter(Boolean)
      .map((path) => require(resolve(process.cwd(), path))),
  );
}
