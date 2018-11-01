# Service-Drains (SD)
SD is a passthrough service. Adopt-a-drain consumes data from a remote datasource (i.e., data.world) through a call to this service.  

## Prerequisites

* Get a Data.World [API key](https://data.world)  
* Install [node and npm](https://www.npmjs.com/get-npm)

## Environment Variables
Developers should create a file (.env) to hold your tokens and user info.
> adopt_a_drain/.env

```
# Provide an owner id for the drain data.
echo DW_USER=citizenlabs

# Enable data.world data with your "read/write" api token
echo DW_AUTH_TOKEN=<get-data.world-api-token> >> .env

# URL for drain data
echo OPEN_SOURCE=https://api.data.world/v0/sql/citizenlabs/grb-storm-drains >> .env
```

## 

