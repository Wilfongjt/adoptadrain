#!/bin/bash
# psql --help
echo '..........................'
echo '# Create or update database'
echo '..........................'
# source 00.psql.warning.sh
# developer install on local machine
psql -U postgres -p 5432 -h localhost -f 01.create.db.sql 
psql -U postgres -p 5432 -h localhost -f 02.create.table.users.sql adopt_a_drain
psql -U postgres -p 5432 -h localhost -f 03.create.table.things.sql adopt_a_drain
psql -U postgres -p 5432 -h localhost -f 04.create.table.reminders.sql adopt_a_drain
