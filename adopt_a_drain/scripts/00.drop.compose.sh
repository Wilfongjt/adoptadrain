#!/bin/bash
echo '.................................'
echo '# Cleanup Docker Database   00.clean.sh'
echo '.................................'
echo '```'
echo 'docker-compose down'
echo 'docker system prune --force'
echo 'docker rmi adopt-a-drain_web'
echo '```'
# stop running docker
docker-compose down

# kill the images
docker system prune --force

# kill the database
echo '.................................'
echo 'Kill adopt_a_drain_web'
echo '.................................'
docker rmi adopt_a_drain_web
echo '.................................'
echo 'Kill adopt_a_drain'
echo '.................................'
docker rmi adopt_a_drain

# compose
source 00.compose.sh
