const { Pool } = require('pg');

let config = {
  dialect: 'pg',
  database: 'test',
  user: 'postgres',
  password: 'postgres',
  host: 'localhost',
  port: 5432
};
let connection;

async function configure(newConfig) {
  config = { ...config, ...newConfig };
  connection = new Pool(config);

  process.on('SIGINT', async () => {
    console.log('calling db close');
    await connection.end();
  });
}
async function close() {
  connection.end();
}

async function command(sql, args = []) {
  return await connection.query(sql, args);
}

async function select(sql, args = []) {
  const result = await command(sql, args);
  return result.rows;
}

async function tableExists(table) {
  const results = await command(`select * from information_schema.tables where table_name = '${table}'`);
  return results.rowCount > 0;
}

let migration_table = '';
async function getPastMigrations() {
  const sql = `select id from ${migration_table}`;
  const migrations = await command(sql);
  if (migrations.rowCount < 1) {
    return [];
  }
  return migrations.rows.map(r => Number(r.id));
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
          run_at timestamp default now()
      )
      `;
    await command(createSql);
  }
}

module.exports = {
  configure,
  command,
  select,
  createSchema,
  getPastMigrations,
  close
};
