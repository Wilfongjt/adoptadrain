\c dbname=adopt_a_drain

CREATE OR REPLACE FUNCTION add_user(email_ VARCHAR(256), password_ VARCHAR(50))
RETURNS INT AS $$
DECLARE last_id int;
BEGIN

  INSERT INTO users (email, encrypted_password) VALUES
    (email_, crypt(password_, gen_salt('bf', 8)))  RETURNING id INTO last_id;

  RETURN last_id;
EXCEPTION
  WHEN unique_violation THEN
    RETURN -23505;

END;
$$ LANGUAGE plpgsql;
