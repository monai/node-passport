/* eslint-disable no-console */
import { inspect } from 'util';
import { pipeline, Transform } from 'stream';
import minimist from 'minimist';
import { consoleLog } from 'stream-util2';

import ParserStream from '../lib/asn1/ber/parser_stream.mjs';
import TreeStream from '../lib/asn1/tree/stream.mjs';
import parser from '../lib/telecom/comprehension_tlv/parser.mjs';
import dos from '../lib/telecom/comprehension_tlv/do/index.mjs';
import { SCtoMS, MStoSC } from '../lib/telecom/sms/direction.mjs';

export default main;

function main(argv) {
  argv = minimist(
    argv.slice(1),
    {
      alias: {
        hex: ['h'],
        ber: ['b'],
      },
    },
  );

  pipeline([
    process.stdin,
    argv.hex && transform(fromHex),
    argv.ber && new ParserStream(),
    argv.ber && new TreeStream(),
    argv.ber && transform(unwrap, true),
    transform(parse, true),
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

function unwrap(tree) {
  return tree.children[0].contents;
}

function parse(data) {
  const out = [];
  const options = {};

  for (const [tag, value] of parser(data)) {
    const dataObject = dos[tag.value];

    if (tag.value === 2) {
      const dir = dataObject.decode(value);
      if (dir.source === 131 && dir.destination === 129) {
        options.direction = SCtoMS;
      } else if (dir.source === 129 && dir.destination === 131) {
        options.direction = MStoSC;
      }
    }

    let string;
    if (dataObject?.inspect) {
      string = dataObject.inspect(value, options);
    } else if (dataObject?.decode) {
      string = dataObject.decode(value, options);
    } else if (value) {
      string = value.toString();
    }

    out.push([
      inspect(tag),
      inspect(value),
      string && inspect(string, { depth: Infinity, colors: true }),
    ].filter(Boolean).join(' '));
  }

  return out.join('\n');
}

function transform(fn, objectMode) {
  return new Transform({
    objectMode,
    transform(chunk, _, done) {
      done(null, fn(chunk));
    },
  });
}
