# Dead simple database migration
```
git clone https://github.com/jefflindholm/migrate.git
```
* Create file(s) in migrations directory
    * #-some-description (anything after number is ignored)
    * everything from start to `-- Down` is executed for the Up command
    * everything after `-- Down` is the rollback
* migrate will run all scripts
* rollback # will rollback incrementally based on data in database NOT the files

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
const migrate = require('tools');

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
dialect: process.env.MIGRATE_DIALECT,
database: process.env.MIGRATE_DATABASE,
user: process.env.MIGRATE_USER,
password: process.env.MIGRATE_PASSWORD,
host: process.env.MIGRATE_HOST,
port: process.env.MIGRATE_PORT,

### command line options to migrate
```
--dialect, -d [string value]
--database, -db [string value]
--user, -u [string value]
--password, -p [string value]
--host, -h [string value]
--port [string value]
--help show usage
```
* `--dialect pg` and `--dialect=pg` are equivalent same for all options

## Examples
```
docker-compose up
```
Will start a local postgres server in docker on port 5432.
```
migrate
```
Will run the sample migrate and create a users table in the database


```
rollback <step> [-f]
```
* step will rollback from the latest to step
* -f will force the rollback to use the file scripts
  * by default the rollback script will from from the mirgation table in the database
