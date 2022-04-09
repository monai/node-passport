// BS ISO/IEC 7816-4:2013

import { dedicatedFile, elementaryFile } from '../../../data_structure.mjs';
import { decode as decodeFileDescriptor } from '../dos/file_descriptor.mjs';

import fcpDedicatedFile from '../fcp/dedicated_file.mjs';
import fcpElementaryFile from '../fcp/elementary_file.mjs';
import fcpDataObject, { dos as fcpDataObjectDos } from '../fcp/data_object.mjs';

// Table 8 — Interindustry templates for file control information
const template = {
  0x62: (node) => {
    const fdDv = node.children.find((dv) => dv.tag.identifier === 0x82);
    const dataObjectDos = node.children.filter(
      (dv) => fcpDataObjectDos.includes(dv.tag.identifier),
    );

    let children;
    if (fdDv) {
      const fd = decodeFileDescriptor(fdDv.contents);
      const { dataStructure } = fd.fileDescriptor;

      if (dataStructure === dedicatedFile) {
        children = fcpDedicatedFile;
      } else if (dataStructure === elementaryFile) {
        children = fcpElementaryFile;
      } else if (dataObjectDos.length > 0) {
        children = fcpDataObject;
      }
    }

    return {
      name: 'fcp',
      description: 'Set of file control parameters (FCP template)',
      children,
    };
  },
  0x64: {
    name: 'fmd',
    description: 'Set of file management data (FMD template)',
  },
  0x6F: {
    name: 'fci',
    description: 'Set of file control parameters and file management data (FCI template)',
  },
};

export default template;
