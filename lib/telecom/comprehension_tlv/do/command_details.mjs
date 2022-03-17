// ETSI TS 102 223 V15.3.0 (2019-07)

import typeOfCommand from '../../cat/type_of_command.mjs';

// 8.6 Command details DO'01
export function encode() {
  throw new Error('Not Implemented');
}

export function decode(data) {
  const [number, type, qualifier] = data;
  const command = typeOfCommand[type];

  const decodedQualifier = command.decode?.(qualifier);

  return {
    number,
    type,
    typeDescription: command.description,
    qualifier: decodedQualifier ?? qualifier,
  };
}
