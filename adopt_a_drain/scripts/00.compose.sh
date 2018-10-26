#!/bin/bash
echo '.................................'
echo '#  Database   00.clean.sh'
echo '.................................'
echo '```'
echo 'docker-compose up'
echo '```'

cd ..

docker-compose up

echo '.................................'
echo '# Update database'
echo '.................................'

cd scripts/db/
source 00.db.sh
