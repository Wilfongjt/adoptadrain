\c dbname=adopt_a_thing_development

CREATE TABLE IF NOT EXISTS reminders (
    id SERIAL PRIMARY KEY,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    from_user_id integer NOT NULL,
    to_user_id integer NOT NULL,
    thing_id integer NOT NULL,
    sent boolean DEFAULT false
);

-- Indices -------------------------------------------------------

CREATE UNIQUE INDEX IF NOT EXISTS reminders_pkey ON reminders(id int4_ops);
CREATE INDEX IF NOT EXISTS index_reminders_on_from_user_id ON reminders(from_user_id int4_ops);
CREATE INDEX IF NOT EXISTS index_reminders_on_sent ON reminders(sent bool_ops);
CREATE INDEX IF NOT EXISTS index_reminders_on_thing_id ON reminders(thing_id int4_ops);
CREATE INDEX IF NOT EXISTS index_reminders_on_to_user_id ON reminders(to_user_id int4_ops);
