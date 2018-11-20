\c dbname=adopt_a_thing_development

CREATE OR REPLACE FUNCTION sign_in(email_ VARCHAR(256), password_ VARCHAR(50))
RETURNS TEXT AS $$
DECLARE rc TEXT;
DECLARE last_id int;
BEGIN

  rc = CONCAT('{"id": -1 "name": "', email_ , '"}');
  SELECT id into last_id FROM users WHERE email = lower(email_) AND encrypted_password = crypt(password_, encrypted_password);
  if FOUND then
    rc = CONCAT('{"id": ' , last_id::VARCHAR(15), ', "name": "', email_ , '"}');
  end if;

  RETURN rc;

END;
$$ LANGUAGE plpgsql;
