#!/bin/bash
database_folder='~/data_df/postgres-persistence/'
echo "********************"
echo " create persistant database folder"
echo "********************"
if [ -d ~/data_df/postgres-persistence/ ]; then
  echo "skipping database folder install: $database_folder"
else
  echo "Installing database folder: $database_folder"
  mkdir ~/data_df/postgres-persistence/
fi

echo "********************"
echo " docker-compose up"
echo "********************"

docker-compose up 
