const { migrate, configure } = require('./tools');
const commandLineParser = require('./command-line');

const options = [
  // { name: 'verbose', alias: 'v', type: Boolean },
  { name: 'dialect', alias: 'd', options: ['pg', 'sqlite'] },
  { name: 'database', alias: 'db', type: String },
  { name: 'user', alias: 'u', type: String },
  { name: 'password', alias: 'p', type: String },
  { name: 'host', alias: 'h', type: String },
  { name: 'port', type: Number, numeric: 'int' },
];

const db_config = commandLineParser(options);
(async() => {
  await migrate('./migrations', db_config);
  console.log('migrations complete');
})();
