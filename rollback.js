const { rollbackMigrations } = require('./db-tools');

(async() => {
    if (process.argv.length < 3) {
        console.log('Requires migration id to roll back to.');
        return;
    }
    await rollbackMigrations(Number(process.argv[2]));
    console.log('rollback complete');
})();
