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
