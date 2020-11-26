#!/usr/bin/env node
/* eslint-disable node/shebang */

const asn1parse = require('../cmd/asn1parse');

asn1parse(process.argv.slice(1));
