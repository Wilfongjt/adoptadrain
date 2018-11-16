\c dbname=adopt_a_thing_development

CREATE OR REPLACE FUNCTION signin(email_ VARCHAR(256), password_ VARCHAR(50))
RETURNS TEXT AS $$
DECLARE rc as TEXT;
BEGIN
 
 
  if exists(SELECT * FROM users WHERE email = lower(email_) AND
                          password = crypt(password_, password)) then
    set rc := CONCAT('{"id": ' , last_id::VARCHAR(15), ', "name": "', email_ , '"}');
  else 
    set rc := CONCAT('{"id": -1 "name": "', email_ , '"}');
  end if

  RETURN rc

EXCEPTION
  WHEN unique_violation THEN
    RETURN CONCAT('{"id": -2, "name": "', email_ , '"}') ;

END;
$$ LANGUAGE plpgsql;
