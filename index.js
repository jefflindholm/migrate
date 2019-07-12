#!/usr/bin/env node
const { migrate, rollback, configure, close } = require('./migrate');
const { commandLineParser } = require('./command-line');

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
    name: 'step',
    alias: 's',
    type: Number,
    numeric: 'int',
    text: 'step to rollback inclusive\n\t\tOnly used with --rollback'
  }
];

const db_config = commandLineParser(options);
(async () => {
  const folder = `${process.cwd()}/migrations`;
  if (db_config.rollback) {
    console.log('Running rollbacks');
    if (!db_config.step) {
      console.log('Requires migration id to roll back to.');
      return;
    }
    const force = db_config.force;
    const step = db_config.step;
    delete db_config.step;
    delete db_config.force;
    delete db_config.rollback;
    await rollback(step, db_config, force ? folder : null);
  } else {
    await migrate(folder, db_config);
  }
  console.log('migration operations complete');
  close();
})();
