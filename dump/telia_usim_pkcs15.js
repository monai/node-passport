/* eslint-disable no-console */
const select = require('../lib/iso7816/select');
const getResponse = require('../lib/iso7816/get_response');
const { ControlParameters } = require('../lib/iso7816/control_parameters');
const SimpleReader = require('../lib/simple_reader');
const parse = require('../lib/asn1/util/parse');
const inspect = require('../lib/asn1/tree/inspect');
const { printError } = require('./util');
const { printBer } = require('../lib/util');
const readBinary = require('../lib/iso7816/read_binary');
const readRecord = require('../lib/iso7816/read_record');
const telecomTemplates = require('../lib/telecom/templates/templates');
const { main } = require('./util');

main(work);
async function work(reader) {
  console.log(`= ATR: ${reader.atr.toString('hex')}`);

  const simpleReader = new SimpleReader(reader);
  let res;
  let tree;
  let cp;

  await reader.connect({ share_mode: reader.reader.SCARD_SHARE_SHARED });

  res = await selectFile(simpleReader, 0x00, 0x04, '3F00', 'Master File');
  if (res.noError()) {
    tree = parse(res.data);
    console.log(res);
    console.log(inspect(tree.node, { template: telecomTemplates, colors: true }));

    cp = new ControlParameters(res.data);
    if (cp.fileLength) {
      res = await readBinary(simpleReader, 0, cp.fileLength);
      console.log(res);
    }
  } else {
    printError(res.toError());
  }

  res = await selectFile(simpleReader, 0x00, 0x04, '2F00', 'EF.DIR');
  if (res.noError()) {
    tree = parse(res.data);
    console.log(res);
    console.log(inspect(tree.node, { template: telecomTemplates, colors: true }));

    cp = new ControlParameters(res.data);
    const { maximumRecordSize, numberOfRecords } = cp.fileDescriptor;

    for (let i = 0; i < numberOfRecords; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      res = await readRecord(simpleReader, i + 1, 0x04, { le: maximumRecordSize });
      if (res.noError()) {
        tree = parse(res.data);
        console.log(res);
        console.log(inspect(tree.node, { template: telecomTemplates, colors: true }));
      }
    }
  } else {
    printError(res.toError());
  }

  res = await selectFile(simpleReader, 0x04, 0x04, 'a000000063504b43532d3135');
  if (res.noError()) {
    tree = parse(res.data);
    console.log(res);
    console.log(inspect(tree.node, { template: telecomTemplates, colors: true }));

    cp = new ControlParameters(res.data);
  } else {
    printError(res.toError());
  }

  res = await selectFile(simpleReader, 0x00, 0x04, '5032');
  if (res.noError()) {
    if (res.data) {
      tree = parse(res.data);
      console.log(res);
      console.log(inspect(tree.node, { template: telecomTemplates, colors: true }));
    }

    cp = new ControlParameters(res.data);
    if (cp.fileLength) {
      res = await readBinary(simpleReader, 0, cp.fileLength);
      if (res.noError()) {
        printBer(res.data);
      } else {
        printError(res.toError());
      }
    }
  } else {
    printError(res.toError());
  }

  res = await selectFile(simpleReader, 0x00, 0x04, '5031');
  if (res.noError()) {
    if (res.data) {
      tree = parse(res.data);
      console.log(res);
      console.log(inspect(tree.node, { template: telecomTemplates, colors: true }));
    }

    cp = new ControlParameters(res.data);
    if (cp.fileLength) {
      res = await readBinary(simpleReader, 0, cp.fileLength);
      if (res.noError()) {
        printBer(res.data);
      } else {
        printError(res.toError());
      }
    }
  } else {
    printError(res.toError());
  }

  res = await selectFile(simpleReader, 0x00, 0x04, '4407');
  if (res.noError()) {
    if (res.data) {
      tree = parse(res.data);
      console.log(res);
      console.log(inspect(tree.node, { template: telecomTemplates, colors: true }));
    }

    cp = new ControlParameters(res.data);
    if (cp.fileLength) {
      res = await readBinary(simpleReader, 0, cp.fileLength);
      console.log(res);
      if (res.noError()) {
        printBer(res.data);
      } else {
        printError(res.toError());
      }
    }
  } else {
    printError(res.toError());
  }

  res = await selectFile(simpleReader, 0x00, 0x04, '4404');
  if (res.noError()) {
    if (res.data) {
      tree = parse(res.data);
      console.log(res);
      console.log(inspect(tree.node, { template: telecomTemplates, colors: true }));
    }

    cp = new ControlParameters(res.data);
    if (cp.fileLength) {
      res = await readBinary(simpleReader, 0, cp.fileLength);
      console.log(res);
      if (res.noError()) {
        printBer(res.data);
      } else {
        printError(res.toError());
      }
    }
  } else {
    printError(res.toError());
  }

  res = await selectFile(simpleReader, 0x00, 0x04, '4422');
  if (res.noError()) {
    if (res.data) {
      tree = parse(res.data);
      console.log(res);
      console.log(inspect(tree.node, { template: telecomTemplates, colors: true }));
    }

    cp = new ControlParameters(res.data);
    if (cp.fileLength) {
      res = await readBinary(simpleReader, 0, cp.fileLength);
      console.log(res);
      if (res.noError()) {
        printBer(res.data);
      } else {
        printError(res.toError());
      }
    }
  } else {
    printError(res.toError());
  }

  res = await selectFile(simpleReader, 0x00, 0x04, '4300', 'Access Control Rules File (ACRF)');
  if (res.noError()) {
    if (res.data) {
      tree = parse(res.data);
      console.log(res);
      console.log(inspect(tree.node, { template: telecomTemplates, colors: true }));
    }

    cp = new ControlParameters(res.data);
    if (cp.fileLength) {
      res = await readBinary(simpleReader, 0, cp.fileLength);
      console.log(res);
      if (res.noError()) {
        printBer(res.data);
      } else {
        printError(res.toError());
      }
    }
  } else {
    printError(res.toError());
  }

  res = await selectFile(simpleReader, 0x00, 0x04, '4310', 'Access Control Conditions File (ACCF)');
  if (res.noError()) {
    if (res.data) {
      tree = parse(res.data);
      console.log(res);
      console.log(inspect(tree.node, { template: telecomTemplates, colors: true }));
    }

    cp = new ControlParameters(res.data);
    if (cp.fileLength) {
      res = await readBinary(simpleReader, 0, cp.fileLength);
      console.log(res);
      if (res.noError()) {
        printBer(res.data);
      } else {
        printError(res.toError());
      }
    }
  } else {
    printError(res.toError());
  }
}
async function selectFile(reader, p1, p2, fileId, label) {
  console.log(`= Select File: ${fileId} ${label}`);

  const res = await select(reader, p1, p2, { data: fileId });
  if (res.sw1[0] === 0x61) {
    return getResponse(reader, { le: res.sw2[0] });
  }

  return res;
}
