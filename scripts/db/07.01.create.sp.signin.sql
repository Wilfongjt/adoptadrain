\c dbname=adopt_a_thing_development

CREATE OR REPLACE FUNCTION signin(email_ VARCHAR(256), password_ VARCHAR(50))
RETURNS TEXT AS $$
DECLARE rc TEXT;
BEGIN
  rc = CONCAT('{"id": -1 "name": "', email_ , '"}');
  if exists(SELECT * FROM users WHERE email = lower(email_) AND
                          password = crypt(password_, password)) then
    rc = CONCAT('{"id": ' , last_id::VARCHAR(15), ', "name": "', email_ , '"}');

  end if;

  RETURN rc;

END;
$$ LANGUAGE plpgsql;
