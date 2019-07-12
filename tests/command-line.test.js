const { parse } = require('../command-line');

const options = [
  { name: 'verbose', alias: 'v', type: Boolean },
  { name: 'dialect', alias: 'd', options: ['pg', 'sqlite'] },
  { name: 'database', alias: 'db', type: String },
  { name: 'user', alias: 'u', type: String },
  { name: 'password', alias: 'p', type: String },
  { name: 'host', alias: 'h', type: String },
  { name: 'port', type: Number, numeric: 'int' },
  {
    name: 'rollback',
    alias: 'r',
    type: Boolean,
    text: 'runs rollback script from database\n\t\tOnly used with --rollback'
  },
  {
    name: 'force',
    alias: 'f',
    type: Boolean,
    text: 'Will force read from files not database\n\t\tOnly used with --rollback'
  },
  {
    name: 'level',
    alias: 'l',
    type: Number,
    numeric: 'int',
    text: 'level to rollback inclusive\n\t\tOnly used with --rollback'
  }
];

test('ensure it parses args right', () => {
  const commandLine = [
    'skip this is node',
    'skip this is js file',
    '--port',
    '1234',
    '--dialect=pg',
    '-db',
    'test.sqlite',
    '--verbose'
  ];
  const results = parse(options, commandLine);
  expect(results.dialect).toBe('pg');
  expect(results.database).toBe('test.sqlite');
  expect(results.port).toBe(1234);
  expect(results.verbose).toBe(true);
});

test('ensure it gets errors when the args are wrong', () => {
  const commandLine = [
    'skip this is node',
    'skip this is js file',
    '--foo',
    '--dialect=pg1',
    '-db=test.sqlite',
    '--port=abc'
  ];
  const results = parse(options, commandLine);
  expect(results.database).toBe('test.sqlite');
  expect(results.errors).toContain('dialect - pg1 not in pg,sqlite');
  expect(results.errors).toContain('Unrecognized option --foo');
  expect(results.errors).toContain('port - abc was not numeric');
});
