# adopt_a_drain

> My superb Nuxt.js project

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

## Clone me
``` bash
# clone adopt_a_drain repo
$ git clone https://github.com/Wilfongjt/adopt_a_drain.git
```
## Build Setup

``` bash
# move to app folder
$ cd adopt_a_drain

# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

```

For detailed explanation on how things work, checkout [Nuxt.js docs](https://nuxtjs.org).

## Docker (alternative to Build Setup)
Skip the Build Setup and pull it all together with a container
``` bash
cd adopt_a_drain/
docker run -p 3000:3000 adopt_a_drain
```
## Docker Compose
Adopt_a_drain is configured for docker-compose. This is the easiest way to get set up.
``` bash
# clone adopt_a_drain repo
$ git clone https://github.com/Wilfongjt/adopt_a_drain.git
# move to app folder
cd adopt_a_drain/
# start docker-compose
docker-compose up
# stop docker-compose
# docker-compose down
```
## Data Storage
### Postgres
Docker-compose sets up an install of Postgres within the container.  This is a disposeable configuration. Anything you do to the database will be lost the next time the container is invoked. This is great for development by terrible for production.
Docker does not create a database, users, nor roles.
You must setup the database manually.
