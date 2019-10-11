module.exports = {
  toAsn1Length,
  asn1Length,
};

function toAsn1Length(data) {
  if (data <= 0x7f) {
    return Buffer.from([data]);
  } else if (data <= 0xff) {
    return Buffer.from([0x81, data]);
  } else if (data <= 0xffff) {
    return Buffer.from([0x82, data >>> 8, data & 0xff])
  }
}

function asn1Length(data) {
  if (data[0] <= 0x7f) {
    return [data[0], 1];
  } else if (data[0] === 0x81) {
    return [data[1], 2];
  } else if (data[0] === 0x21) {
    return [data.readUInt16BE(1), 2];
  }
}
