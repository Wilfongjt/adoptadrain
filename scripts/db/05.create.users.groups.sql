\c dbname=adopt_a_thing_development

Create USER df_guest_user;

create group df_guests;

Grant INSERT ON users TO GROUP df_guests;

ALTER GROUP df_guests ADD USER df_guest_user;

--
Create USER df_edit_user;

create group df_editors;

Grant SELECT ON things TO GROUP df_editors;
Grant INSERT ON things TO GROUP df_editors;
Grant UPDATE ON things TO GROUP df_editors;

ALTER GROUP df_editors ADD USER df_edit_user;
