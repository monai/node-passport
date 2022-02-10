const regexp = new RegExp(`
  (?<year>\\d{2})
  (?<month>\\d{2})
  (?<day>\\d{2})
  (?<hours>\\d{2})
  (?<minutes>\\d{2})
  (?<seconds>\\d{2})?
  Z|(?:
      (?<dsign>[+-])
      (?<dhours>\\d{2})
      (?<dminutes>\\d{2})
    )`.replace(/\s/g, ''));

const signs = { '+': 1, '-': -1 };

export const inspect = decode;

export function encode() {
  throw new Error('Not implemented');
}

export function decode(data) {
  const match = data.toString().match(regexp);

  const numericComponents = [
    'year',
    'month',
    'day',
    'hours',
    'minutes',
    'seconds',
    'dhours',
    'dminutes',
  ];

  const components = numericComponents.reduce((acc, comp) => {
    acc[comp] = parseInt(match.groups[comp], 10);
    return acc;
  }, {});
  const sign = signs[match.groups.dsign] || 0;
  // RFC 5280 4.1.2.5.1.
  // FIXME: (2021-04-25) Century change year should be parametrized
  components.year = (components.year >= 50 ? 1900 : 2000) + components.year;

  return new Date(Date.UTC(
    components.year,
    components.month - 1,
    components.day,
    components.hours + sign * (components.dhours || 0),
    components.minutes + sign * (components.dminutes || 0),
    components.seconds || 0,
  ));
}
