import { pipeline } from 'readable-stream';
import { writePromise } from 'stream-util2';

import ControlParameters from './iso7816/control_parameters.js';
import select from './iso7816/select.js';
import ReadBinaryStream from './iso7816/read_binary_stream.js';

export default readFile;

async function readFile(reader, options = {}) {
  // eslint-disable-next-line prefer-destructuring
  const le = options.le;
  let offset = 0;
  let length = options.length || 0;

  if ('shortFileId' in options) {
    offset += (0x80 | options.shortFileId) << 8;
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
    new ReadBinaryStream(reader, { le, length, offset }),
    outP,
  );

  return outP;
}
