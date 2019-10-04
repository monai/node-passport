const crypto = require('crypto');
const pcsc = require('pcsclite');
const async = require('async');

const { authentication, computeSessionKeys } = require('./lib/doc9309/bac');
const { dbak } = require('./lib/doc9309/dbak');
const { CommandAPDU, ResponseAPDU } = require('./lib/doc9309/apdu');
const { protect, unprotect, asn1Length } = require('./lib/doc9309/secure');

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
        computeKeys,
        authenticate,
        externalAuthenticate(reader, protocol),
        deriveKeys,
        readFile(reader, protocol)
      ], done);
    }
  });
}

function setApplication(reader, protocol) {
  return (done) => {
    // SELECT application
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
    reader.transmit(message, 10, protocol, function (err, res) {
      if (err) {
        done(err);
      } else {
        options.bac = {
          rndIc: res.slice(0, 8)
        };
        done(null, options);
      }
    });
  };
}

function computeKeys(options, done) {
  options.bac.keys = dbak(kmrz);
  done(null, options);
}

function authenticate(options, done) {
  crypto.randomBytes(24, (err, rnd) => {
    if (err) {
      done(err);
    } else {
      const rndIfd = rnd.slice(0, 8);
      const kIfd = rnd.slice(8, 24);
      Object.assign(options.bac, { rndIfd, kIfd });

      const { keys, rndIc } = options.bac;
      options.bac.keysIfd = authentication(keys, rndIc, rndIfd, kIfd);
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

function deriveKeys(options, done) {
  const [ksEnc, ksMac, ssc] = computeSessionKeys(options);
  options.bac.session = {
    ksEnc,
    ksMac,
    ssc,
  };

  done(null, options);
}

function readFile(reader, protocol) {
  return (options, done) => {
    const cmdData = Buffer.from('011e', 'hex');
    const apdu = new CommandAPDU(0x00, 0xa4, 0x02, 0x0c, { data: cmdData });
    const protected = protect(options.bac.session, apdu);

    reader.transmit(protected.toBuffer(), 16, protocol, (err, res) => {
      if (err) {
        done(err);
      } else {
        const unprotected = unprotect(options.bac.session, new ResponseAPDU(res));
        let offset = 0;
        readBinary(reader, protocol, options.bac.session, offset, 4, (err, res) => {
          if (err) {
            done(err);
          } else {
            done(null, options);
          }
        });
      }
    });
  };
}

function readBinary(reader, protocol, session, offset, le, done) {
  const p1 = offset >>> 8;
  const p2 = offset & 0xff;
  const apdu = new CommandAPDU(0x00, 0xb0, p1, p2, { le });
  const protected = protect(session, apdu);

  reader.transmit(protected.toBuffer(), 40, protocol, (err, res) => {
    if (err) {
      done(null, err);
    } else {
      const unprotected = unprotect(session, new ResponseAPDU(res));

      const [bodySize, o] = asn1Length(unprotected.data.slice(1));
      const offset = o + 1;

      const header = unprotected.data.slice(0, offset);
      console.log(bodySize, offset, header);

      done(null);
    }
  });
}
