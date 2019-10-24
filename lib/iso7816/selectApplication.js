const { CommandApdu, ResponseApdu } = require('./apdu');

module.exports = selectApplication;

async function selectApplication(reader, application) {
  const apdu = new CommandApdu(0x00, 0xa4, 0x04, 0x0c, { data: application });
  const res = await reader.transmit(apdu.toBuffer(), 2);
  return new ResponseApdu(res);
}
