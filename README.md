# Dead simple postgres migration
```
git clone https://github.com/jefflindholm/migrate.git
```
* change config.js to have your specific details
* Create file(s) in migrations directory
    * #-some-description (anything after number is ignored)
    * everything from start to '-- Down' is executed for the Up command
    * everything after '-- Down' is the rollback
* migrate will run all scripts
* rollback # will rollback incrementally based on data in database NOT the files

## Examples
```
docker-compose up
```
Will start a local server in docker on port 5432.
```
migrate
```
Will run the sample migrate and create a users table in the database



## TODO
* add rollback # -f to rollback from the files
