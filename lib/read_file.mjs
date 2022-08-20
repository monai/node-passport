import controlParameters from './iso7816/util/control_parameters.mjs';
import select from './iso7816/select.mjs';
import readEntireBinary from './iso7816/read_entire_binary.mjs';

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

    const cp = controlParameters(res.data);
    length = cp.fileLength;
  }

  return readEntireBinary(reader, { le, length, offset });
}
