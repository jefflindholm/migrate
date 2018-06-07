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

async function test(path) {
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

    // read all the files
    migrations = await Promise.all(migrations.map(async migration => {
        const text = fs.readFileSync(`${path}/${migration.file}` ,'utf-8');
        const [ignore, op1, cmd1, op2, cmd2] = text.split(/^--\s+?(up|down)\b/mi);
        console.log(`-${migration.file}----------------------------`)
        console.log(`${op1}: "${cmd1}"`);
        console.log(`${op2}: "${cmd2}"`);
    }));

}

(async() => {
    await test('./migrations');
})();
