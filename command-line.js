// { name: 'verbose', alias: 'v', type: Boolean },

function addError(results, error) {
  if (!results.errors) results.errors = [];
  results.errors = [...results.errors, error];
}
function addResult(results, option, value) {
  if (option.options) {
    if (option.options.indexOf(value) === -1) {
      addError(results, `${option.name} - ${value} not in ${option.options}`);
      return;
    }
  }
  if (option.type === Array) {
    avalue = results[option.name] || [];
    avalue.push(value);
    value = avalue;
  } else if (option.type === Number) {
    let number;
    if (!option.numeric || option.numeric === 'int') {
      number = Number.parseInt(value);
    } else {
      number = Number.parseFloat(value);
    }
    if (Number.isNaN(number)) {
      addError(results, `${option.name} - ${value} was not numeric`);
      return;
    }
    value = number;
  }
  results[option.name] = value;
}

function help(options) {
  let helpText = 'Possible arguments\n';
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
    helpText += `${name}${sep}${alias} ${typeName}${valid} ${text}\n`;
  }
  helpText += '--help Show this text\n';
  return helpText;
}

function parse(options, argv) {
  const results = {};
  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    const equal = arg.indexOf('=', 2); // we can always skip first 2 characters
    let value = null;

    if (arg === '--help') {
      return { help: help(options) };
    }

    const option = options.find(
      op =>
        (op.name && op.name === arg.slice(2, op.name.length + 2)) ||
        (op.alias && op.alias === (equal !== -1 ? arg.slice(1, equal) : arg.slice(1)))
    );

    if (option) {
      if (option.type === Boolean) {
        value = true;
      } else if (equal === -1) {
        value = argv[i + 1];
        i++;
      } else {
        value = arg.slice(equal + 1);
      }
    } else {
      addError(results, `Unrecognized option ${arg}`);
    }

    if (value) {
      addResult(results, option, value);
    }
  }
  return results;
}

module.exports = {
  parse,
  commandLineParser: options => {
    const results = parse(options, process.argv);
    if (results.help) {
      console.log(results.help);
      process.exit();
    }
    return results;
  }
};
