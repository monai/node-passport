const crypto = require('crypto');
const pcsc = require('pcsclite');
const async = require('async');

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

      async.waterfall([
        setApplication(reader, protocol),
        getChallenge(reader, protocol),
        authenticate,
        externalAuthenticate(reader, protocol)
      ], done);
    }
  });
}

function setApplication(reader, protocol) {
  return (done) => {
    const message = Buffer.from('00a4040c07A0000002471001', 'hex');
    reader.transmit(message, 2, protocol, (err, res) => {
      if (err) {
        done(err);
      } else {
        done(null, {
          selectApplication: res
        });
      }
    });
  };
}

function getChallenge(reader, protocol) {
  return (options, done) => {
    // GET CHALLENGE
    const message = Buffer.from([0x00, 0x84, 0x00, 0x00, 0x08]);
    reader.transmit(message, 10, protocol, function (err, challenge) {
      if (err) {
        done(err);
      } else {
        options.bac = {
          challenge
        };
        done(null, options);
      }
    });
  };
}

function authenticate(options, done) {
  crypto.randomBytes(24, (err, rnd) => {
    if (err) {
      done(err);
    } else {
      options.bac.keysIfd = authentication(options.bac.challenge, rnd, dbak(kmrz));
      done(null, options);
    }
  });
}

function externalAuthenticate(reader, protocol) {
  return (options, done) => {
    const payload = Buffer.concat(options.bac.keysIfd);
    // EXTERNAL AUTHENTICATE
    const message = Buffer.concat([
      Buffer.from([0x00, 0x82, 0x00, 0x00, payload.length]),
      payload,
      Buffer.from([0x28])
    ]);

    const [eIfd, mIfd] = options.bac.keysIfd;
    console.log('payload', payload.length, payload.toString('hex'));
    console.log('eIfd:', eIfd.length, eIfd.toString('hex'));
    console.log('mIfd:', mIfd.length, mIfd.toString('hex'));
    console.log('message:', message.length, message.toString('hex'));

    reader.transmit(message, 42, protocol, (err, res) => {
      if (err) {
        done(err);
      } else {
        options.bac.keysIc = res;
        done(null, options);
      }
    });
  };
}
