const moment = require('moment');

const formats = [
  'YYMMDDhhmmZ',
  "YYMMDDhhmm+hh'mm'",
  "YYMMDDhhmm-hh'mm'",
  'YYMMDDhhmmssZ',
  "YYMMDDhhmmss+hh'mm'",
  "YYMMDDhhmmss-hh'mm'",
];

module.exports = {
  encode,
  decode,
  inspect,
};

function encode() {

}

function decode(data) {
  return moment.utc(data.toString(), formats).toDate();
}

function inspect(data) {
  return decode(data);
}
