#! /usr/bin/env node
const path = require('path');
const { migrate, rollback } = require('../db-tools');

function commandArgs(argv) {
    const { dir: _dir, name: _name } = path.parse(process.argv[1]);
    const args = { _dir, _name };
    let cur = 2;
    while(cur < argv.length) {
        const arg = argv[cur];
        if (arg.startsWith('--')) {
            const vals = arg.slice(2).split('=');
            if (vals.length > 1) {
                args[vals[0]] = vals[1];
            } else {
                args[vals[0]] = true;
            }
        } else if (arg.startsWith('-')) {
            const name = arg.slice(1);
            args[name] = true;
        }
        cur += 1;
    }
    return args;
}

(async() => {

    const args = commandArgs(process.argv);
    const dir = args.dir || 'migrations';
    const migrations = path.join(args._dir, dir);

    console.log(process.argv[0]);
    console.log(path.parse(process.argv[1]));
    console.log(args);

    if (args.h || args.help) {
        console.log('Usage:', args._name);
        console.log('options ------ no options means migrate')
        console.log('--rolback=#');
        console.log('--dir=<script dir>');
        console.log('-f<orce> (read from the script dir for rollback)')
        console.log('-h<elp> (this text)');
        process.exit();
    }
    if (args.rollback) {
        let step = 1;
        if (args.rollback !== true) {
            step = Number(args.rollback);
        }
        const force = (args.f || args.force);
        //await rollback(step, force ? migrations : null);
    } else {
        //await migrate(migrations);
    }
    console.log('complete');
})();
