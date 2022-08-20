import { promisify } from 'util';
import { pipeline } from 'stream';
import { PromiseWriteStream } from 'stream-util2';
import ReadBinaryStream from './read_binary_stream.mjs';

export default async function readEntireBinary(reader, options) {
  const out = new PromiseWriteStream();
  promisify(pipeline)(
    new ReadBinaryStream(reader, options),
    out,
  );

  return out.promise;
}
