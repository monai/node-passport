const { CommandAPDU, ResponseAPDU } = require('./apdu');

module.exports = selectApplication;

async function selectApplication(reader) {
  const apdu = new CommandAPDU(0x00, 0xa4, 0x04, 0x0c, { data: 'A0000002471001' });
  const res = await reader.transmit(apdu.toBuffer(), 2);
  return new ResponseAPDU(res);
}
