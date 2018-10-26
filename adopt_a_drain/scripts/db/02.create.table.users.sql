

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    organization character varying,
    email character varying NOT NULL,
    voice_number character varying,
    sms_number character varying,
    address_1 character varying,
    address_2 character varying,
    city character varying,
    state character varying,
    zip character varying,
    admin boolean DEFAULT false,
    encrypted_password character varying NOT NULL DEFAULT ''::character varying,
    reset_password_token character varying,
    reset_password_sent_at timestamp without time zone,
    remember_created_at timestamp without time zone,
    sign_in_count integer NOT NULL DEFAULT 0,
    current_sign_in_at timestamp without time zone,
    last_sign_in_at timestamp without time zone,
    current_sign_in_ip character varying,
    last_sign_in_ip character varying,
    first_name character varying,
    last_name character varying
);

-- Indices -------------------------------------------------------

CREATE UNIQUE INDEX IF NOT EXISTS users_pkey ON users(id int4_ops);
CREATE UNIQUE INDEX IF NOT EXISTS index_users_on_email ON users(email text_ops);
CREATE UNIQUE INDEX IF NOT EXISTS index_users_on_reset_password_token ON users(reset_password_token text_ops);
