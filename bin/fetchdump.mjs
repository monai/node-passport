#!/usr/bin/env node
/* eslint-disable node/shebang */

import fetchdump from '../cmd/fetchdump.mjs';

fetchdump(process.argv.slice(1));
