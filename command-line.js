// { name: 'verbose', alias: 'v', type: Boolean },

function addResult(results, option, value) {
  if (option.type === Array) {
    avalue = results[option.name] || [];
    avalue.push(value);
    value = avalue;
  }
  results[option.name] = value;
}

function help(options) {
  console.log('Possible arguments');
  for (option of options) {
    let typeName;
    switch (option.type) {
      case Boolean:
        typeName = 'toggle on';
        break;
      case String:
        typeName = '<string>';
        break;
      case Array:
        typeName = '<string>, allows multiple values by specifying multiple times';
        break;
      case Number:
        typeName = '<number>';
        break;
      default:
        typeName = '';
        break;
    }
    const name = option.name ? `--${option.name}` : '';
    const alias = option.alias ? `-${option.alias}` : '';
    const sep = option.name && option.alias ? ', ' : '';
    const valid = option.options
      ? '<' + option.options.reduce((p, c, i) => p + (i > 0 ? ', ' : '') + c, 'one of: [') + ']>'
      : '';
    const text = option.text || '';
    console.log(`${name}${sep}${alias} ${typeName}${valid} ${text}`);
  }
  console.log('--help Show this text');
  process.exit();
}

module.exports = options => {
  const results = {};
  for (let i = 2; i < process.argv.length; i++) {
    const arg = process.argv[i];
    const alias = arg.slice(1, 2); // always the same regardless of the option
    const equal = arg.indexOf('=', 2); // we can always skip first 2 characters
    let found = false;

    if (arg === '--help') {
      help(options);
      return {};
    }

    for (option of options) {
      if (!option.name) continue;
      const name = arg.slice(2, option.name.length + 2);
      let value = null;
      if (option.name && option.name === name) {
        if (option.type === Boolean) {
          value = true;
        } else if (equal === -1) {
          value = process.argv[i + 1];
          i++;
        } else {
          value = arg.slice(equal + 1);
        }
      } else if (option.alias && option.alias === alias) {
        if (option.type === Boolean) {
          value = true;
        } else if (equal === -1) {
          value = process.argv[i + 1];
          i++;
        } else {
          value = arg.slice(equal + 1);
        }
      }
      if (value) {
        if (option.type === Number) {
          let number;
          if (!option.numeric || option.numeric === 'int') {
            Number.parseInt(value);
          } else {
            value = Number.parseFloat(value);
          }
          if (value === NaN) {
            console.error(`Value was not numeric ${value} argument ${arg}`);
            value = null;
          }
        }
        addResult(results, option, value);
        found = true;
      }
    }
    if (!found && arg.slice(0, 1) === '-') {
      console.error(`Unrecognized option ${arg} ignored`);
    }
  }
  return results;
};
