// ETSI TS 102 223 V15.3.0 (2019-07)

const { decode: decodeSmsDataCodingScheme } = require('../../sms_data_coding_scheme');

module.exports = {
  decode,
};

// 8.15 Text string DO'0D
function decode(data) {
  const codingScheme = decodeSmsDataCodingScheme(data[0]);
  data = data.slice(1);

  if ([1, 2].includes(codingScheme.characterSet)) {
    return data.toString();
  }

  return undefined;
}
