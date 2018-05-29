const { migrate } = require('./db-tools');

(async() => {
    await migrate('./migrations');
    console.log('migrations complete');
})();
