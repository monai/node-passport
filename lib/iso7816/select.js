const CommandApdu = require('./CommandApdu');
const { Iso7816Error } = require('./error');

module.exports = select;

async function select(reader, p1, p2, data, le) {
  const apdu = new CommandApdu(0x00, 0xa4, p1, p2, { data, le });
  const res = await reader.transmit(apdu);

  if (!res.noError()) {
    throw new Iso7816Error(res.sw);
  }
  return res;
}
