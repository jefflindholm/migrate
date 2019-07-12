# Dead simple database migration

## database table creation
* the following is the migration tracking table added to the database
```sql
create table dead_simple_migrations (
    id integer primary key,
    name text,
    up text,
    dn text,
    run_at timestamp default now()
)
```

## Settings
* order of precedence
  * defaults
  * environment vars
  * programatic setting

### Code config - call to migrate if using like a library
* dialect is currently either `pg` for postgres or `sqlite` for sqlite

```javascript
const migrate = require('simple-db-migrate');

// These are the default settings if none are used
let config = {
  dialect: 'pg',
  database: 'test',
  user: 'postgres',
  password: 'postgres',
  host: 'localhost',
  port: 5432,
};

// call migrate(full_path_to_migrations, config options);
await migrate('./migrations', config);
```

### Environment vars
* dialect: process.env.MIGRATE_DIALECT
* database: process.env.MIGRATE_DATABASE
* user: process.env.MIGRATE_USER
* password: process.env.MIGRATE_PASSWORD
* host: process.env.MIGRATE_HOST
* port: process.env.MIGRATE_PORT

### command line options to `simple-db-migrate`
* migrate and rollback options
  * --verbose, -v `toggle on`
  * --dialect, -d `one of [pg, sqlite]`
  * --database, -db `string`
  * --user, -u `string`
  * --password, -p `string`
  * --host, -h `string`
  * --port `number`
* rollback only options
  * --rollback, -r `toggle on` runs rollback script from database
  * --force, -f `toggle on` Will force read from files not database
  * --step, -s `number` step to rollback inclusive
* misc
  * --help Show help text

* `--dialect pg` and `--dialect=pg` are equivalent same for all options

```bash
migrate <options>
```


## if you are in the repo, not the npm install
```
docker-compose up
```
Will start a local postgres server in docker on port 5432.
