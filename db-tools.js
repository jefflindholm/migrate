const fs = require('fs');
const { Pool } = require('pg');
const config = require('./config');

const connection = new Pool(config);

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

async function command(sql ,args = []) {
    return await connection.query(sql, args);
}
const createSql = `
create table pg_migrations (
    id integer primary key,
    name text,
    up text,
    dn text,
    run_at timestamp default now()
)
`;
async function createSchema() {
    const sql = `select * from information_schema.tables where table_name = 'pg_migrations'`;
    const table = await command(sql);
    if (table.rowCount < 1) {
        const info = await command(createSql);
    }
}
async function getPastMigrations() {
    const sql = 'select id from pg_migrations';
    const migrations = await command(sql);
    if (migrations.rowCount < 1) {
        return [];
    }
    return migrations.rows.map(r => Number(r.id));
}

async function migrate(path) {
    await createSchema();

    const dirs = await getDir(path);
    let migrations = dirs
        .map(x => x.match(/^(\d+).(.*?)\.sql$/))
        .filter(x => x !== null)
        .map(x => ({ id: Number(x[1]), name: x[2], file: x[0] }))
        .sort((a,b) => a.id - b.id);

    if (!migrations.length) {
        console.error(`No migrations found in ${path}`);
        return;
    }

    const past = await getPastMigrations();
    // read all the files
    migrations = await Promise.all(migrations.map(async migration => {
        const text = fs.readFileSync(`${path}/${migration.file}` ,'utf-8');
        const [up, dn] = text.split(/^--\s+?down\b/mi);
        if (!dn) {
            throw new Error(`${migration.file} does not have a -- down section`);
        }
        migration.up = up.replace(/^-- .*?$/gm, '').trim();
        migration.dn = dn.trim();
        return migration;
    }));

    // remove any that have been run
    migrations = migrations.filter(m => !past.includes(m.id));

    const insert = 'INSERT INTO pg_migrations(id, name, up, dn) VALUES($1, $2, $3, $4)';
    for(let m = 0; m < migrations.length; m++) {
        const migrate = migrations[m];
        console.log(`executing migrate from ${migrate.file}`)
        const args = [migrate.id, migrate.name, migrate.up, migrate.dn];
        try {
            await command('BEGIN');
            await command(migrate.up);
            await command(insert, args);
            await command('COMMIT');
        } catch(e) {
            await command('ROLLBACK');
            console.error(e);
            console.error(`${migrate.file} failed all remaing migrations skipped`);
            throw e;
        }
    }
}

async function rollbackMigrations(migrationId) {
    const cmd = 'SELECT id, dn, name FROM pg_migrations WHERE id >= $1 ORDER BY id DESC';
    const details = await command(cmd, [migrationId]);
    for(let d = 0; d < details.rowCount; d++) {
        const detail = details.rows[d];
        try {
            await command('BEGIN');
            await command(detail.dn);
            await command('DELETE FROM pg_migrations WHERE id = $1', [detail.id]);
            await command('COMMIT');
        } catch (e) {
            await command('ROLLBACK');
            console.error(e);
            console.error(`${detail.id} - ${detail.name} failed to rollback`);
            throw e;
        }
    }
}
async function close() {
    await connection.end();
}
module.exports = {
    command,
    migrate,
    rollbackMigrations,
    close,
}
