# Dockerized Projects API
Signals micro-service on Node.js. This a micro-service count total quantity signals and time series signals.

* [Architecture](#architecture)
* [Technologies](#technologies)
* [Environment Variables](#environment-variables)
* [Events](#events)
* [API](#api)
* [License](#license)

# Architecture
The application is a REST API service with database and messaging service (Bus) dependencies.

# Technologies
* Node.js
* Cassandra
* Express.js
* Passport.js
* Official nsqjs driver for NSQ messaging service

# Environment Variables
The service should be properly configured with following environment variables.

Key | Value | Description
:-- | :-- | :-- 
MONGODB_CONNECTION | mongodb://mongo_host:mongo_port/projects | MongoDB connection string.
TOKEN_ACCESSSECRET | MDdDRDhBOD*** | Access token secret.
TOKEN_RELATIONSECRET | MDdDRDhBOD*** | Relation token secret.
NSQD_ADDRESS | bus.yourdomain.com | A hostname or an IP address of the NSQD running instance.
NSQD_PORT | 4150 | A TCP port number of the NSQD running instance to publish events.
CASSANDRA_NODES | cassandra.node1.io,cassandra.node2.io | Cassandra cluster nodes
CASSANDRA_KEYSPACE | signals | Cassandra keyspce.
SIGNAL_ALLOWED |views,reshares | Signal IDs for time series.
PORT | 8080 | Container port.

# Events
The service generates events to the Bus (messaging service) in response to API requests.

## Send events
Topic | Message | Description
:-- | :-- | :--
signal-sends | {id: *relation_id*, ownerId: *owner_id*, userId: *user_id*} | Created signal.

# API
## DTO
### Signal Dto
| Param   | Description |
|----------|-------------|
|ownerId| ID of counter owner. For ex. *projectId*|
|relationId| ID of relation entity - counter ID|
|counter| Total quantity signlas for this counter|

### Series Dto
| Param   | Description |
|----------|-------------|
|timestamp| Timestamp |
|counter| Total quantity signlas for this timestamp|

## GET /heatbeat
Heart beat for loadbalncer.
### Response
| HTTP       |      Value                                                         |
|------------|--------------------------------------------------------------------|
| StatusCode | 2010                                                               |

## POST /:signalId
Add signal by ID.

### Request
#### Header
| Param   | Value |
|----------|-------------|
| relation-token     | "[relationToken]" |

### Response
| HTTP       |      Value                                                         |
|------------|--------------------------------------------------------------------|
| StatusCode | 201                                                                |

## GET /:signalId/hours?start=&finish=&top=
Gets time series of signals per hour by signal ID for user owner.
### Request
#### Header
| Param   | Value |
|----------|-------------|
| Authorization     | "JWT [accessToken]" |
| relation-token     | "[relationToken]" |

### Query Params
| Param    | Description |
|----------|-------------|
| start    |  Snterval start (Ex. 2016-01-26T15:42:19Z)|
| finish    |  The end of interval (Ex. 2016-03-26T15:42:19Z)|
| top    |  Quantity series for getting|

### Response
| HTTP       |      Value                    |
|------------|-------------------------------|
| StatusCode | 200                           |
| Body | List of [Series Dto](#series-dto)   |

## GET /:signalId/days?start=&finish=&top=
Gets time series of signals per day by signal ID for user owner. 
### Request
#### Header
| Param   | Value |
|----------|-------------|
| Authorization     | "JWT [accessToken]" |
| relation-token     | "[relationToken]" |

### Query Params
| Param    | Description |
|----------|-------------|
| start    |  Snterval start (Ex. 2016-01-26T15:42:19Z)|
| finish    |  The end of interval (Ex. 2016-03-26T15:42:19Z)|
| top    |  Quantity series for getting|

### Response
| HTTP       |      Value                    |
|------------|-------------------------------|
| StatusCode | 200                           |
| Body | List of [Series Dto](#series-dto)   |

## GET /:signalId/weeks?start=&finish=&top=
Gets time series of signals per week by signal ID for user owner.
### Request
#### Header
| Param   | Value |
|----------|-------------|
| Authorization     | "JWT [accessToken]" |
| relation-token     | "[relationToken]" |

### Query Params
| Param    | Description |
|----------|-------------|
| start    |  Snterval start (Ex. 2016-01-26T15:42:19Z)|
| finish    |  The end of interval (Ex. 2016-03-26T15:42:19Z)|
| top    |  Quantity series for getting|

### Response
| HTTP       |      Value                    |
|------------|-------------------------------|
| StatusCode | 200                           |
| Body | List of [Series Dto](#series-dto)   |

## GET /:signalId/months?start=&finish=&top=
Gets time series of signals per month by signal ID for user owner. 
### Request
#### Header
| Param   | Value |
|----------|-------------|
| Authorization     | "JWT [accessToken]" |
| relation-token     | "[relationToken]" |

### Query Params
| Param    | Description |
|----------|-------------|
| start    |  Snterval start (Ex. 2016-01-26T15:42:19Z)|
| finish    |  The end of interval (Ex. 2016-03-26T15:42:19Z)|
| top    |  Quantity series for getting|

### Response
| HTTP       |      Value                    |
|------------|-------------------------------|
| StatusCode | 200                           |
| Body | List of [Series Dto](#series-dto)   |

## GET /:signalId/?ids=
Gets list of signal counters for list of owners IDs. **Only for *signalId* from [Environment Variables](#environment-variables) *SIGNAL_ALLOWED*.**
### Request
### Query Params
| Param    | Description |
|----------|-------------|
| ids    |  List of comma separated owner IDs. Max IDs quantity - 50. (Ex. 56f5044d05933312008564e0,56f5044d05933312008565f3,56f5044d0593331200856ge2)|

### Response
| HTTP       |      Value                    |
|------------|-------------------------------|
| StatusCode | 200                           |
| Body | List of [Signal Dto](#signal-dto)   |

# License
Source code is under GNU GPL v3 [license](LICENSE).

