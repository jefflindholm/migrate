-- Up
alter table ic_fields add column engine text;
alter table ic_fields add column result text;

-- Down
alter table ic_fields drop column engine;
alter table ic_fields drop column result;
