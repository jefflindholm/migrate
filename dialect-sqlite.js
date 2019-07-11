const sqlite3 = require('sqlite3').verbose();
let connection;

function connect(dbname) {
  return new Promise(resolve => {
    connection = new sqlite3.Database(dbname, err => {
      if (err) console.log(err.message);
      console.log('db created')
      resolve();
    });
  });
}

function runCommand(sql, args = []) {
  return new Promise(resolve => {
    connection.all(sql, args, (err, rows) => {
      if (err) throw err;
      resolve(rows);
    });
  });
}

async function tableExists(table) {
  const results = await command(`select * from sqlite_master where type='table' and name = '${table}'`);
  return results.length > 0;
}

async function configure(newConfig) {
  await connect(newConfig.database);

  process.on('SIGINT', async () => {
    console.log('calling db close');
    await connection.close();
  });
}

async function command(sql ,args = []) {
  sql.replace(/\$\d/, '?');
  return await runCommand(sql, args);
}

let migration_table = '';
async function getPastMigrations() {
  const sql = `select id from ${migration_table}`;
  const migrations = await command(sql);
  if (migrations.length < 1) {
      return [];
  }
  return migrations.map(r => Number(r.id));
}

async function createSchema(tablename) {
  migration_table = tablename;
  const exists = await tableExists(migration_table);
  if (!exists) {
      const createSql = `
      create table ${migration_table} (
          id integer primary key,
          name text,
          up text,
          dn text,
          run_at date_time default current_timestamp
      )
      `;
      await command(createSql);
    }
}

module.exports = {
  configure,
  command,
  createSchema,
  getPastMigrations,
};
