-- Up
create table test (
    id SERIAL PRIMARY key,
    data_json JSON,
    data_jsonb JSONB,
    created timestamp,
    updated timestamp
);
-- Down
drop table test;
