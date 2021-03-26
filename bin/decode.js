#!/usr/bin/env node
/* eslint-disable node/shebang */

const decode = require('../cmd/decode');

decode(...process.argv.slice(1));
