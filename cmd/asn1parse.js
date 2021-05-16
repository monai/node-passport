/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
/* eslint-disable no-console */
const { resolve } = require('path');
const minimist = require('minimist');
const stream = require('stream-util2');
const parse = require('../lib/asn1/util/parse');
const noTail = require('../lib/asn1/util/no_tail');
const inspect = require('../lib/asn1/tree_inspect');
const treeForcedParser = require('../lib/asn1/tree_forced_parser');

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

  process
    .stdin
    .pipe(stream.buffer())
    .pipe(stream.writable((chunk, done) => {
      if (argv.hex) {
        chunk = Buffer.from(chunk.toString(), 'hex');
      }

      let tree = parse(chunk);
      if (argv.force) {
        tree = treeForcedParser(tree);
      }

      const options = {
        depth: 20,
        colors: true,
        type: type(argv.type),
      };

      if (argv.tail === false) {
        tree = noTail(tree);
      }

      console.log(inspect(tree, options));

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
