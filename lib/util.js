module.exports = {
  formatHex,
}

function formatHex(number) {
  let str = number.toString(16);
  return str.length % 2 ? `0${str}` : str;
}
