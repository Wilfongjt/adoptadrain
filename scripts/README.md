# adoptadrain
# Prostgres

* PG is shared through Dreamfactory


Adopt a Drain
A containerized version of adopt-a-drain (AAD).
## Why
You may ask why rewrite an application that runs fine as Rudy appliction.
* Node's dependencies are easier for me to resolve
* Node is a little less fragile than ruby
* Nuxtjs, Vuejs and Ruby are all pretty organized in terms of applicaton folders but Vuejs and Nuxtjs are both way more organized with regards to code.  
* Vuejs Components keep a develper from creating too much abstraction.  Ruby code gets smeared accross files until all meaning is lost.

## Features
* Storage for User accounts and adopted drains
* Establishes a persistance database

## Changes from original
* No longer stores the drains in the postgres database.
* Reduced storage needs to just those drains that have been adopted

## Prerequisites
* None

## Install
* The install is handled by docker-compose
* The database install is persistant.
* Docker-compose uses a volume to establish database persistance
* The database is installed in the ~/data_df folder 


## Environment Variables
Envionment variables related to Postgres
* DB_HOST=db
* DB_USER=postgres

```
# For development
# Override database settings as the docker host:
echo DB_HOST=db > .env
echo DB_USER=postgres >> .env
```
otherwise
* Configure in your production environment
* Heroku can store environment variables and deploy as needed.

## Dataflow
| process | client | database |
| :-- | :-- | :-- |
| New Account  |    |    |
| Update Account  |    |    |
| Sign In |   |   |
| Sign Out |  |  |
| Adopt  |  |  |
| Unadopt |  |  |


user_add
user_del
adoption_add
adoption_del
get_adoptions
get_user_adoptions

add_user
sign_in
add_adoption
del_adoption
get_adoptions
get_user_adoptions

user_upsert



ins_thing
upd_thing
drop_thing 


## Docker Compose
Adopt_a_drain is configured for docker-compose. This is the easiest way to get set up for development.

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

## DB Scripts
* Scripts are found in the repo's scripts folder
* Scripts are run by docker-compose on ```docker-compose up``` 


