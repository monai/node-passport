const { Readable } = require('stream');
const { Machine, interpret } = require('xstate');
const stream = require('stream-util2');
const select = require('./iso7816/select');
const readBinary = require('./iso7816/readBinary');
const { Iso7816Error } = require('./iso7816/error');
const { decode: decodeTag } = require('./asn1/tag');
const { decode: decodeLength } = require('./asn1/length');

const maxHeader = Math.ceil(Math.log2(Number.MAX_SAFE_INTEGER) / 7) + 3;

function createMachine(options) {
  return Machine({
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
      headerRead: {
        on: {
          CONTINUE: [
            {
              target: 'readingContents',
              cond: { type: 'isNotEof' },
            },
            { target: 'finished' },
          ],
        },
      },
      readingContents: {
        invoke: {
          id: 'readingContents',
          src: readContentsP,
          onDone: {
            target: 'contentsRead',
            actions: ['readContents'],
          },
          onError: { target: 'error' },
        },
      },
      contentsRead: {
        on: {
          CONTINUE: [
            {
              target: 'readingContents',
              cond: { type: 'isNotEof' },
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
        ctx.length = data.length;
        ctx.contentsOffset = data.contentsOffset;
        ctx.readable.push(data.data);
      },
      readContents: (ctx, { data }) => {
        data = data.data;
        ctx.contentsOffset += data.length;
        ctx.offset += data.length;
        ctx.readable.push(data);
      }
    },
    guards: {
      isNotEof: ({ length, contentsOffset }) => length > contentsOffset,
    }
  });
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
    length: null,
    contentsOffset: null,
  }, options);

  if ( ! options.mode in ['sfi', 'select']) {
    throw new Error(`unknown mode ${options.mode}`);
  }

  const machine = createMachine(options);
  const service = interpret(machine);

  const readable = new Readable({
    ...options,
    read(size) {
      service.send({ type: 'CONTINUE', size });
    }
  });

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
    const res = await select(ctx.reader, 0x02, 0x0c, ctx.fileId);
    if (!res.noError()) {
      throw new Iso7816Error(res.sw);
    }
  }
  return offset;
}

async function readHeaderP(ctx, _event) {
  let res;
  let eof = false;

  res = await readBinary(ctx.reader, ctx.offset, maxHeader);
  if (!res.noError() && res.sw1 === 0x6c) {
    res = await readBinary(ctx.reader, ctx.offset, res.sw2);
    if (!res.noError()) {
      throw new Iso7816Error(res.sw);
    }
    eof = true;
  }

  let data = res.toBuffer();

  const tagLength = decodeTag(data).pop();
  const [length, o] = decodeLength(data.slice(tagLength));
  const offset = res.toBuffer().length;
  const contentsOffset = offset - (tagLength + o);
  data = data.slice(0, offset);

  return {
    length,
    offset,
    contentsOffset,
    data,
    eof,
  };
}

async function readContentsP(ctx, event) {
  const le = Math.min(ctx.length - ctx.contentsOffset, event.size);
  const res = await readBinary(ctx.reader, ctx.offset, le);
  if (!res.noError()) {
    throw new Iso7816Error(res.sw);
  }
  return res;
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
  createMachine,
  createReadStream,
  readFile,
};
