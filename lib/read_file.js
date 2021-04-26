const { pipeline } = require('readable-stream');
const { writePromise } = require('stream-util2');

const ControlParameters = require('./iso7816/control_parameters');
const select = require('./iso7816/select');
const { createReadStream } = require('./iso7816/read_binary_stream');

module.exports = readFile;

async function readFile(reader, options = {}) {
  // eslint-disable-next-line prefer-destructuring
  const le = options.le;
  let offset = 0;
  let length = options.length || 0;

  if ('shortFileId' in options) {
    offset += (0x80 ^ options.shortFileId) << 8;
  } else {
    const res = await select(reader, 0x02, 0x04, { data: options.fileId, le: 0x100 });
    if (!res.noError()) {
      throw res.toError();
    }

    const cp = new ControlParameters(res.data);
    length = cp.fileLength;
  }

  const outP = writePromise();
  pipeline(
    createReadStream(reader, { le, length, offset }),
    outP,
  );

  return outP;
}
