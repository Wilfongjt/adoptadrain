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

DF_API_KEY=<get-from-dreamfactory-apps>
DF_SOURCE=http://localhost:8080
DF_HOST=localhost
DF_PORT=8080
GUEST_USER=guest@adopt_a_drain.com
GUEST_PW=aA1!aaaa
```

## Clone me
``` bash
# clone adopt_a_drain repo
$ git clone https://github.com/Wilfongjt/adopt_a_drain.git
```

For detailed explanation on how things work, checkout [Nuxt.js docs](https://nuxtjs.org).

## Docker Compose
Adopt_a_drain is configured for docker-compose. This is the easiest way to get things running.
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

## Postgres

* An empty Postgres database (adpot_a_drain) is setup via scripts run by docker-compose

### Persist your database
* database is persisted in the docker-compose file
* the postgres database is found in the ~/data_df/pgdata/ folder
* a persistant postgres database will only setup on the first run of docker-compose

### Scripts
* The postgres database is setup as part of the first docker-compse run
* the scripts do not destroy data if run more than once

## Dreamfactory
* http://localhost:8080
* the first run of docker-compose installs an unconfigured dreamfactory.  
* you must configure dreamfactory before running adopt_a_drain

### Persist your dreamfactory configuration
* dreamfactory is persisted in the docker-compose file
* the Dreamfactory configuration, and databases in found in the ~/data_df/ folder
* a persistant dreamfactory install will only need to be configured one time

### Add Public Role 
applies to dreamfactory only. postgress roles are handled elsewhere
* goto Dreamfactory

* Roles > Basic > Name > public
* Roles > Basic > Description > public/guest role
* Roles > Basic > Active > yes

* Roles > Basic > Service > user
* Roles > Basic > Component > register/
* Roles > Basic > Access > POST, GET
* Roles > Basic > Requester > API, SCRIPT
* Roles > Basic > Advanced Filters > N/A

* Roles > Basic > Service > system
* Roles > Basic > Component > user/*
* Roles > Basic > Access > POST, GET
* Roles > Basic > Requester > API
* Roles > Basic > Advanced Filters > N/A

* Roles > Basic > Service > adopt_a_drain
* Roles > Basic > Component > _table/users/*
* Roles > Basic > Access > POST, GET
* Roles > Basic > Requester > API
* Roles > Basic > Advanced Filters > 0

* Roles > Basic > Service > adopt_a_drain
* Roles > Basic > Component > _table/things/*
* Roles > Basic > Access > POST, GET
* Roles > Basic > Requester > API
* Roles > Basic > Advanced Filters > 0

* Roles > Basic > Service > adopt_a_drain
* Roles > Basic > Component > _table/reminders/*
* Roles > Basic > Access > POST, GET
* Roles > Basic > Requester > API
* Roles > Basic > Advanced Filters > 0

* Roles > Basic > Service > adopt_a_drain
* Roles > Basic > Component > _func/add_user
* Roles > Basic > Access > POST, GET, PUT, PATCH, DELETE
* Roles > Basic > Requester > API
* Roles > Basic > Advanced Filters > 0

### Add Guest User
* Create
* Users > Create
* Users > Create > Basic > Username > guest@adoptadrain.com
* Users > Create > Basic > Email > guest@adoptadrain.com
* Users > Create > Basic > First Name > guest
* Users > Create > Basic > Last Name > guest
* Users > Create > Basic > Last Name > guest
* Users > Create > Basic > Display Name > guest
* Users > Create > Basic > Phone > <leave-blank>
* Users > Create > Basic > Set Password > yes 
* Users > Create > Basic > Active > yes

### Add App
* Apps > Create > Application Name > Adopt-a-Drain-GR
* Apps > Create > Description > Adopt a Drain
* Apps > Create > App Location > No Storage Required > True
* Apps > Create > Assign a Default Role Filter > <leave-blank>
* Apps > Create > Assign a Default Role > public

### Services
Services > Manage > system > Config > Default application > Adopt-a-Drain-GR
Services > Manage > user > Config > Allow Open Registration > yes 
Services > Manage > user > Config > Default Open Reg Role > public
Services > Manage > user > Config > Per App Open Reg Role > <leave-blank>
Services > Manage > user > Config > Open Reg Email Service >  <select-blank>

Services > Create > Info > Service Type > Database >  PostgresSQL
Services > Create > Info > Name > adopt_a_drain
Services > Create > Info > Label > Adopt a Drain
Services > Create > Info > Description > Adopt a Drain
Services > Create > Info > Active > yes

Services > Create > Config > Host > db 
Services > Create > Config > Port Number > 5432
Services > Create > Config > Database > adopt_a_drain
Services > Create > Config > Username > postgres
Services > Create > Config > Password > <leave-blank>
Services > Create > Config > Schema > <leave-blank>
Services > Create > Config > Character Set > utf8
Services > Create > Config > SSL Mode > disable
Services > Create > Config > Timezone > <leave-blank>
Services > Create > Config > Application Name > <leave-blank>
Services > Create > Config > Driver Options > <leave-blank>
Services > Create > Config > Driver Attributes > <leave-blank>
Services > Create > Config > Additional SQL Statements > <leave-blank>
Services > Create > Config > Allow upsert > false
Services > Create > Config > Maximum Records > 1000
Services > Create > Config > Data Retrival Caching Enabled > false
Services > Create > Config > Cache Time To Live (minutes) > 0

### CORS
Config > CORS > +
Config > CORS > path > *
Config > CORS > Description > accept all connections
Config > CORS > Origins > *
Config > CORS > Headers > *
Config > CORS > Exposed Headers > <leave-blank>
Config > CORS > Max Age > 0
Config > CORS > Methods > GET, POST, PUT , PATCH, DELETE
Config > CORS > Supports Credentials > false
Config > CORS > Enabled > true




