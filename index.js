const crypto = require('crypto');
const pcsc = require('pcsclite');

const { authentication } = require('./lib/doc9309/bac');
const { dbak } = require('./lib/doc9309/dbak');

const kmrz = process.env.KMRZ;
if ( ! kmrz) {
  throw 'Environment variable KMRZ is not defined';
}

const pl = pcsc();
pl.on('reader', function (reader) {
  reader.on('error', function (err) {
    console.error(err);
  });

  reader.on('status', function (status) {
    const changes = reader.state ^ status.state;

    if (changes & reader.SCARD_STATE_EMPTY && status.state & reader.SCARD_STATE_EMPTY) {
      console.log('card removed');
    } else if (changes & reader.SCARD_STATE_PRESENT && status.state & reader.SCARD_STATE_PRESENT) {
      console.log('card present');
      connect(reader, (err, out) => {
        if (err) {
          console.error(err);
        } else {
          console.log(out);
        }
      });
    }
  });
});

function connect(reader, done) {
  reader.connect({ share_mode: reader.SCARD_SHARE_SHARED }, function (err, protocol) {
    if (err) {
      console.error(err);
    } else {
      console.log('protocol', protocol);
      getChallenge(reader, protocol, (err, res) => {
        if (err) {
          done(err);
        } else {
          done(null, res);
        }
      });
    }
  });
}

function getChallenge(reader, protocol, done) {
  // GET CHALLENGE
  const message = Buffer.from([0x00, 0x84, 0x00, 0x00, 0x08]);
  reader.transmit(message, 10, protocol, function (err, challenge) {
    crypto.randomBytes(24, (err, rnd) => {
      const bacKeys = authentication(challenge, rnd, dbak(kmrz));

      console.log(bacKeys)
      done();
    });
  });
}
