import Parser from '../ber/parser.mjs';
import build from '../tree/build.mjs';

export default function parse(data, options) {
  const dataValue = build(Parser.components(data), options);
  if (options?.type) {
    dataValue.node.setType(options.type);
  }
  if (options?.template) {
    dataValue.node.setTemplate(options.template);
  }

  return dataValue;
}
