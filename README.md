# adoptadrain

Adopt a Drain

A containerized version of adopt-a-drain (AAD).

## Features

* Docker-compose 
* Separate container for each service
* A web site to demonstrate services
* Nuxtjs


## Prerequisites

* Get a Google Map [App Key](https://developers.google.com/maps/documentation/javascript/get-api-key)
* Get a Data.World [API key](https://data.world)  
* Install [node and npm](https://www.npmjs.com/get-npm)
* Install [Postres](https://www.postgresql.org) on your development machine.  
* Install [psql](https://www.postgresql.org/download/) on your development machine

## Environment Variables
Developers should create a file (.env) to hold your tokens and user info.
> adopt_a_drain/.env

```
# Override database settings as the docker host:
echo DB_HOST=db > .env
echo DB_USER=postgres >> .env

# Enable google maps with your dev or prod google map api key
echo GOOGLE_MAPS_JAVASCRIPT_API_KEY=<get-google-map-api-key> >> .env

# Provide an owner id for the drain data.
echo DW_USER=citizenlabs

# Enable data.world data with your "read/write" api token
echo DW_AUTH_TOKEN=<get-data.world-api-token> >> .env

# URL for drain data
echo OPEN_SOURCE=https://api.data.world/v0/sql/citizenlabs/grb-storm-drains >> .env
```


## Docker Compose
Adopt_a_drain is configured for docker-compose. This is the easiest way to get set up.

``` bash
# clone adoptadrain repo
$ git clone https://github.com/Wilfongjt/adoptadrain.git

# move to app folder
cd adoptadrain/

# start docker-compose
docker-compose up

# stop docker-compose
# docker-compose down
```
