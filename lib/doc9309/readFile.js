const { Readable } = require('stream');
const { Machine, interpret } = require('xstate');
const stream = require('stream-util2');
const { CommandAPDU } = require('./apdu');
const { decode: decodeLength } = require('../asn1/length');
const { Iso7816Error } = require('../iso7816.js');

function createService(options) {
  const machine = Machine({
    id: 'binaryReader',
    context: options,
    initial: 'started',
    states: {
      started: {
        on: {
          INITIALIZE: {
            target: 'initialized',
            actions: ['initialize'],
          },
        },
      },
      initialized: { on: { CONTINUE: 'selectingFile' } },
      selectingFile: {
        invoke: {
          id: 'selectingFile',
          src: selectFileP,
          onDone: {
            target: 'fileSelected',
            actions: ['selectFile']
          },
          onError: { target: 'error' },
        }
      },
      fileSelected: { on: { CONTINUE: 'readingHeader' } },
      readingHeader: {
        invoke: {
          id: 'readingHeader',
          src: readHeaderP,
          onDone: {
            target: 'headerRead',
            actions: ['readHeader'],
          },
          onError: { target: 'error' },
        },
      },
      headerRead: { on: { CONTINUE: 'readingBody' } },
      readingBody: {
        invoke: {
          id: 'readingBody',
          src: readBodyP,
          onDone: {
            target: 'bodyRead',
            actions: ['readBody'],
          },
          onError: { target: 'error' },
        },
      },
      bodyRead: {
        on: {
          CONTINUE: [
            {
              target: 'readingBody',
              cond: { type: 'bodyNotFinished' },
            },
            { target: 'finished' },
          ],
        },
      },
      finished: {
        type: 'final',
        entry: ['finish'],
      },
      error: {
        type: 'final',
        entry: ['setError'],
      },
    },
  }, {
    actions: {
      initialize: (ctx, event) => {
        ctx.readable = event.readable;
      },
      setError: ({ readable }, { data }) => {
        readable.destroy(data);
      },
      finish: ({ readable }) => {
        readable.push(null);
      },
      selectFile: (ctx, { data }) => {
        ctx.offset = data;
        ctx.readable.push();
      },
      readHeader: (ctx, { data }) => {
        ctx.offset = data.offset;
        ctx.bodyLength = data.length;
        ctx.bodyRead = 0;
        ctx.readable.push(data.data);
      },
      readBody: (ctx, { data }) => {
        data = data.data;
        ctx.bodyRead += data.length;
        ctx.offset += data.length;
        ctx.readable.push(data);
      }
    },
    guards: {
      bodyNotFinished: ({ bodyLength, bodyRead }) => bodyLength > bodyRead,
    }
  });

  return interpret(machine);
}

function createReadStream(options) {
  let mode = options.mode;
  if (!mode) {
    if ('sfi' in options) {
      mode = 'sfi';
    } else if ('fileId' in options) {
      mode = 'select';
    }
  }

  options = Object.assign({
    highWaterMark: 0xe0,

    mode,
    offset: 0,
    bodyLength: null,
    bodyRead: -1,
  }, options);

  if ( ! options.mode in ['sfi', 'select']) {
    throw new Error(`unknown mode ${options.mode}`);
  }

  const readable = new Readable({
    ...options,
    read(size) {
      service.send({ type: 'CONTINUE', size });
    }
  });
  const service = createService(options);
  service.onDone(() => service.stop());
  service.start();
  service.send('INITIALIZE', { readable });

  return readable;
}

async function selectFileP(ctx, _event) {
  let offset = 0;
  if (ctx.mode === 'sfi') {
    offset = (0x80 ^ ctx.sfi) << 8;
  } else if (ctx.mode === 'select') {
    const res = await selectFile(ctx.sreader, ctx.fileId);
    if (!res.noError()) {
      throw new Iso7816Error(res.sw);
    }
  }
  return offset;
}

async function readHeaderP(ctx, _event) {
  const res = await readBinary(ctx.sreader, ctx.offset, 4);
  if (!res.noError()) {
    throw new Iso7816Error(res.sw);
  }
  const [length, o] = decodeLength(res.data.slice(1));
  const offset = o + 1

  return {
    length,
    offset,
    data: res.data.slice(0, offset)
  }
}

async function readBodyP(ctx, event) {
  const le = Math.min(ctx.bodyLength - ctx.bodyRead, event.size);
  const res = await readBinary(ctx.sreader, ctx.offset, le);
  if (!res.noError()) {
    throw new Iso7816Error(res.sw);
  }
  return res;
}

function selectFile(sreader, fileId) {
  const apdu = new CommandAPDU(0x00, 0xa4, 0x02, 0x0c, { data: fileId });
  return sreader.transmit(apdu, 16);
}

function readBinary(sreader, offset, le) {
  const p1 = offset >>> 8;
  const p2 = offset & 0xff;
  const apdu = new CommandAPDU(0x00, 0xb0, p1, p2, { le });

  return sreader.transmit(apdu, 0xff);
}

function readFile(options) {
  return new Promise((resolve, reject) => {
    createReadStream(options)
    .on('error', reject)
    .pipe(stream.buffer())
    .pipe(stream.writable((chunk, done) => {
      resolve(chunk);
      done();
    }))
  });
}

module.exports = {
  createReadStream,
  selectFile,
  readBinary,
  readFile,
};
