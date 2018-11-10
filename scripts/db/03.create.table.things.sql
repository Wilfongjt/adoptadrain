\c dbname=adopt_a_thing_development

CREATE TABLE IF NOT EXISTS things (
    id SERIAL PRIMARY KEY,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    name character varying,
    lat numeric(16,14) NOT NULL,
    lng numeric(17,14) NOT NULL,
    city_id integer,
    user_id integer,
    system_use_code character varying,
    deleted_at timestamp without time zone,
    adopted_name character varying,
    jurisdiction character varying
);

-- Indices -------------------------------------------------------

CREATE UNIQUE INDEX IF NOT EXISTS things_pkey ON things(id int4_ops);
CREATE UNIQUE INDEX IF NOT EXISTS index_things_on_city_id ON things(city_id int4_ops);
CREATE INDEX IF NOT EXISTS index_things_on_deleted_at ON things(deleted_at timestamp_ops);
