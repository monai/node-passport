const { Iso7816Error } = require('./error');

module.exports = {
  assertSwOk,
};

function assertSwOk(res) {
  if (!res.noError()) {
    throw new Iso7816Error(res.sw);
  }
}
