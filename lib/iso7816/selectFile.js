const { CommandApdu } = require('./apdu');

module.exports = selectFile;

function selectFile(reader, fileId) {
  const apdu = new CommandApdu(0x00, 0xa4, 0x02, 0x0c, { data: fileId });
  return reader.transmit(apdu, 16);
}
