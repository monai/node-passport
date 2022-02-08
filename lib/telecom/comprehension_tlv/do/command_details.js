// ETSI TS 102 223 V15.3.0 (2019-07)

const typeOfCommand = require('../../cat/type_of_command');

module.exports = {
  decode,
};

// 8.6 Command details DO'01
function decode(data) {
  const number = data[0];
  const type = data[1];
  const qualifier = data[2];

  return {
    number,
    type,
    typeDescription: typeOfCommand[type].description,
    qualifier,
  };
}
