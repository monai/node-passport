import Parser from '../ber/parser.mjs';
import build from '../tree/build.mjs';

export default function parse(data, options) {
  const dataValue = build(Parser.components(data), options);
  if (options?.template) {
    dataValue.setTemplate(options.template);
  }

  return dataValue;
}
