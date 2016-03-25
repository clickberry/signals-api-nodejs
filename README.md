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
Gets time series of signals per hour.
### Request
#### Header
| Param   | Value |
|----------|-------------|
| Authorization     | "JWT [accessToken]" |
| relation-token     | "[relationToken]" |

### Query Params
| Param    | Description |
|----------|-------------|
| start    |  Snterval start |
| finish    |  The end of interval|
| top    |  Quantity series for getting|

### Response
| HTTP       |      Value                    |
|------------|-------------------------------|
| StatusCode | 200                           |
| Body | List of [Series Dto](#series-dto)   |









## GET /all?last=&top=
Gets all public projects from all users.

### Request
### Query Param
| Param    | Description |
|----------|-------------|
| last    |  Last project ID since which will finding projects |
| top    |  Quantity projects for getting|

### Response
| HTTP       |      Value                                                         |
|------------|--------------------------------------------------------------------|
| StatusCode | 200                                                            |
| Body | List of [Project Dto](#project-dto)                                                            |

## GET /:projectId
Gets project by id. Anonymous user gets project if *isPrivate=false*.

### Request
#### Header
| Param   | Value ||
|----------|-------------|---|
| Authorization     | "JWT [accessToken]" |***Optional***|

### Response
| HTTP       |      Value                                                         |
|------------|--------------------------------------------------------------------|
| StatusCode | 200                                                            |
| Body | [Project Dto](#project-dto)                                                            |

## DELETE /:projectId
Removes user project by id.

### Request
#### Header
| Param   | Value |
|----------|-------------|
| Authorization     | "JWT [accessToken]" |

### Response
| HTTP       |      Value                                                         |
|------------|--------------------------------------------------------------------|
| StatusCode | 200                                                            |

## GET /user/:userId
Gets all public user projects by userId.

### Response
| HTTP       |      Value                                                         |
|------------|--------------------------------------------------------------------|
| StatusCode | 200                                                            |
| Body | List of [Project Dto](#project-dto)                                                            |

# License
Source code is under GNU GPL v3 [license](LICENSE).

