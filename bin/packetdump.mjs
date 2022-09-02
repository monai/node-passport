#!/usr/bin/env node
/* eslint-disable node/shebang */

import packetdump from '../cmd/packetdump.mjs';

packetdump(process.argv.slice(1));
