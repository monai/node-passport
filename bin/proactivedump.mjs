#!/usr/bin/env node
/* eslint-disable node/shebang */

import proactivedump from '../cmd/proactivedump.mjs';

proactivedump(process.argv.slice(1));
