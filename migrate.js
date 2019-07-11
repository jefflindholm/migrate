#!/usr/bin/env node
const { migrate, configure } = require('./tools');
const commandLineParser = require('./command-line');

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
    db_config.delete('step');
    db_config.delete('force');
    db_config.delete('rollback');
    await rollback(step, force ? folder : null);
  } else {
    await migrate(folder, db_config);
  }
  console.log('migration operations complete');
})();
