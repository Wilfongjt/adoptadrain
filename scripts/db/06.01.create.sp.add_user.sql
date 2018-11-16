\c dbname=adopt_a_thing_development

CREATE OR REPLACE FUNCTION add_user(email_ VARCHAR(256), password_ VARCHAR(50))
RETURNS TEXT AS $$
DECLARE last_id int;
BEGIN
 
  INSERT INTO users (email, encrypted_password) VALUES
    (email_, crypt(password_, gen_salt('bf', 8)))  RETURNING id INTO last_id;

  
  RETURN CONCAT('{"id": ' , last_id::VARCHAR(15), ', "name": "', email_ , '"}');

EXCEPTION
  WHEN unique_violation THEN
    RETURN CONCAT('{"id": -23505, "name": "', email_ , '"}') ;

END;
$$ LANGUAGE plpgsql;
