const { rollback } = require('./db-tools');

(async() => {
    let force = false;
    let step = null;
    for(let i = 2; i < process.argv.length; i++) {
        const arg = process.argv[i];
        if (arg === '-f') {
            force = true;
        } else {
            step = Number(arg);
        }
    }
    if (!step) {
        console.log('Requires migration id to roll back to.');
        return;
    }
    await rollback(step, force ? './migrations' : null);
    console.log('rollback complete');
})();
