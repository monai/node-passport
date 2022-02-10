#!/usr/bin/env node
/* eslint-disable node/shebang */

import asn1parse from '../cmd/asn1parse.mjs';

asn1parse(process.argv.slice(1));
