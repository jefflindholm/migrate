const fs = require('fs');

let db;
let config;

async function getDir(path) {
  return new Promise((resolve, reject) => {
    fs.readdir(path, (err, items) => {
      if (err) {
        reject(err);
      } else {
        resolve(items);
      }
    });
  });
}

async function configure(newConfig) {
  config = {
    dialect: process.env.MIGRATE_DIALECT || 'pg',
    database: process.env.MIGRATE_DATABASE || 'test',
    user: process.env.MIGRATE_USER || 'postgres',
    password: process.env.MIGRATE_PASSWORD || 'postgres',
    host: process.env.MIGRATE_HOST || 'localhost',
    port: process.env.MIGRATE_PORT || '5432',
    verbose: false,
    ...newConfig
  };

  const dialect = config.dialect.toLowerCase();
  db = require(`./dialect-${dialect}`);

  await db.configure(config);
}

async function command(sql, args = []) {
  return await db.command(sql, args);
}

const migration_table = 'dead_simple_migrations';

function checkCmd(op1, cmd1, op2, cmd2) {
  const errors = [];
  op1 = op1.toLowerCase();
  op2 = op2.toLowerCase();
  if (op1 !== 'up' && op1 !== 'down') {
    errors.push(`invalid operation ${op1 || 'first operation'}`);
  }
  if (op2 !== 'up' && op2 !== 'down') {
    errors.push(`invalid operation ${op2 || 'second operation'}`);
  }
  if (op1 === op2) {
    errors.push(`duplicate operation ${op1 || 'unknown operation'}`);
  }
  if (!cmd1) {
    errors.push(`empty command for ${op1 || 'first operation'}`);
  }
  if (!cmd2) {
    errors.push(`empty command for ${op2 || 'second operation'}`);
  }
  return errors.length > 0 ? errors : null;
}

async function getFileMigrations(path) {
  const dirs = await getDir(path);
  let migrations = dirs
    .map(x => x.match(/^(\d+).(.*?)\.sql$/))
    .filter(x => x !== null)
    .map(x => ({ id: Number(x[1]), name: x[2], file: x[0] }))
    .sort((a, b) => a.id - b.id);

  if (!migrations.length) {
    console.error(`No migrations found in ${path}`);
    return;
  }

  // read all the files
  migrations = await Promise.all(
    migrations.map(async migration => {
      if (config.verbose) console.log(`processing file: ${path}/${migration.file}`);
      const text = fs.readFileSync(`${path}/${migration.file}`, 'utf-8');
      const [ignore, op1, cmd1, op2, cmd2] = text.split(/^--\s*(up|down)\b/im);
      const errors = checkCmd(op1, cmd1, op2, cmd2);
      if (errors) {
        throw new Error(`${migration.file} ${errors.join(', ')}`);
      }
      if (op1.toLowerCase() === 'up') {
        migration.up = cmd1.trim();
        migration.dn = cmd2.trim();
      } else {
        migration.up = cmd2.trim();
        migration.dn = cmd1.trim();
      }
      return migration;
    })
  );
  return migrations;
}

const debug = false;

async function doMigrate(detail) {
  if (debug) {
    console.log(detail.up);
    console.log('------');
    return;
  }
  const insert = `INSERT INTO ${migration_table}(id, name, up, dn) VALUES($1, $2, $3, $4)`;
  const args = [detail.id, detail.name, detail.up, detail.dn];
  try {
    await command('BEGIN');
    await command(detail.up);
    await command(insert, args);
    await command('COMMIT');
  } catch (e) {
    await command('ROLLBACK');
    console.error(e);
    console.error(`${detail.file} failed all remaing migrations skipped`);
    throw e;
  }
}

async function migrate(path, options = {}) {
  await configure(options);
  await db.createSchema(migration_table);

  let migrations = await getFileMigrations(path);

  const past = await db.getPastMigrations();

  // remove any that have been run
  migrations = migrations.filter(m => !past.includes(m.id));

  for (let m = 0; m < migrations.length; m++) {
    const migrate = migrations[m];
    console.log(`executing migrate from ${migrate.file}`);
    await doMigrate(migrate);
  }
}

async function doRollback(detail) {
  if (debug) {
    console.log(detail.dn);
    console.log('------');
    return;
  }
  try {
    await command('BEGIN');
    await command(detail.dn);
    await command(`DELETE FROM ${migration_table} WHERE id = $1`, [detail.id]);
    await command('COMMIT');
  } catch (e) {
    await command('ROLLBACK');
    console.error(e);
    console.error(`${detail.id} - ${detail.name} failed to rollback`);
    throw e;
  }
}

async function rollback(migrationId, config = {}, migrationDir = null) {
  await configure(config);

  if (migrationDir) {
    let migrations = await getFileMigrations(migrationDir);
    const past = await getPastMigrations();
    // remove any that have been not run
    migrations = migrations.filter(m => past.includes(m.id) && m.id >= migrationId).sort((a, b) => b.id - a.id);
    for (let m = 0; m < migrations.length; m++) {
      await doRollback(migrations[m]);
    }
  } else {
    const cmd = `SELECT id, dn, name FROM ${migration_table} WHERE id >= $1 ORDER BY id DESC`;
    const details = await command(cmd, [migrationId]);
    for (let d = 0; d < details.rowCount; d++) {
      const detail = details.rows[d];
      await doRollback(detail);
    }
  }
}
async function close() {
  await dbClose();
}
module.exports = {
  migrate,
  rollback
};
