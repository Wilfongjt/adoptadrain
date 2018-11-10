#!/bin/bash
echo "These scripts will not run from the Dockerfile or docker-compose.yml. Psql is not installed within the image and shouldn't be installed for securitiy reasons"
echo "Connect from an admin account and run these scripts"
