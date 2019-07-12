# Dead simple database migration

## example create table migration (more examples at end)
* filename `001-user-table.sql
```sql
-- Up
create table users (
    id SERIAL PRIMARY key,
    user_id TEXT,
    password TEXT,
    active BOOLEAN,
    created timestamp,
    updated timestamp
);
-- Down
drop table users;
```

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

## my other npm package(s)

https://www.npmjs.com/package/fluent-sql
* SQL generator
* lets you do something like the following
```javascript
const query = new SqlQuery()
  .select(users.id, users.username, users.password)
  .from(users)
  .where(users.username.eq('jdoe'));
  // ...
const userDetail = new SqlQuery()
  .select(users.star(), addresses.star())
  .from(users)
  .join(addresses.on(addresses.id).using(users.addressId));
```

## more examples
* add some user data (don't do this, since the password is plain text)
```sql
-- Up
insert into users (
    user_id,
    password,
    active,
    created,
    updated,
Values
('id1', 'password11', 1, '1/1/2019', '1/1/2019'),
('id2', 'password12', 0, '1/1/2019', '1/1/2019'),
('id3', 'password13', 0, '1/1/2019', '1/1/2019'),
('id4', 'password14', 1, '1/1/2019', '1/1/2019'),
('id5', 'password15', 0, '1/1/2019', '1/1/2019'),
('id6', 'password16', 1, '1/1/2019', '1/1/2019');
-- Down
delete from users where id = 'id1';
delete from users where id = 'id2';
delete from users where id = 'id3';
delete from users where id = 'id4';
delete from users where id = 'id5';
delete from users where id = 'id6';
```
* alter table NOTE: this will not work for SQLite since it does not support `drop column`

```sql
-- Up
alter table some_table add column engine text;
alter table some_table add column result text;

-- Down
alter table some_table drop column engine;
alter table some_table drop column result;
```

## if you are in the repo, not the npm install
```
docker-compose up
```
Will start a local postgres server in docker on port 5432.
