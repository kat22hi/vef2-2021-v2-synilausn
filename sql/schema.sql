CREATE TABLE IF NOT EXISTS signatures(
  id serial primary key,
  name varchar(128) not null,
  nationalId varchar(10) not null unique,
  comment varchar(400) not null,
  anonymous boolean not null default true,
  signed timestamp with time zone not null default current_timestamp
);

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username CHARACTER VARYING(255) NOT NULL,
  password CHARACTER VARYING(255) NOT NULL
  );