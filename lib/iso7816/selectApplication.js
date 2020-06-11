const CommandApdu = require('./CommandApdu');
const { Iso7816Error } = require('./error');

module.exports = selectApplication;

async function selectApplication(reader, application) {
  const apdu = new CommandApdu(0x00, 0xa4, 0x04, 0x0c, { data: application });
  const res = await reader.transmit(apdu);
  if (!res.noError()) {
    throw new Iso7816Error(res.sw);
  }
  return res;
}
