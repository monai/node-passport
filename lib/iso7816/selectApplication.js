const { CommandApdu, ResponseApdu } = require('./apdu');

module.exports = selectApplication;

function selectApplication(reader, application) {
  const apdu = new CommandApdu(0x00, 0xa4, 0x04, 0x0c, { data: application });
  return reader.transmit(apdu, 2);
}
