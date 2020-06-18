const CommandApdu = require('./CommandApdu');

module.exports = select;

async function select(reader, p1, p2, data, le) {
  let bl;
  if (typeof data !== 'string' || ! data instanceof Buffer) {
    bl = data.bl;
    le = data.le;
    data = data.data;
  }

  const apdu = new CommandApdu(0x00, 0xa4, p1, p2, { data, le });

  return reader.transmit(apdu, bl);
}
