CREATE KEYSPACE IF NOT EXISTS signals WITH REPLICATION = {'class': 'NetworkTopologyStrategy', 'us-west': 3};

CREATE TABLE IF NOT EXISTS signals.signals_by_hour (
	owner_id text,
	relation_id text,
	timestamp timestamp,
	counter counter,
	PRIMARY KEY ((owner_id, relation_id), timestamp)
);

CREATE TABLE IF NOT EXISTS signals.signals_by_day (
	owner_id text,
	relation_id text,
	timestamp timestamp,
	counter counter,
	PRIMARY KEY ((owner_id, relation_id), timestamp)
);

CREATE TABLE IF NOT EXISTS signals.signals_by_week (
	owner_id text,
	relation_id text,
	timestamp timestamp,
	counter counter,
	PRIMARY KEY ((owner_id, relation_id), timestamp)
);

CREATE TABLE IF NOT EXISTS signals.signals_by_month (
	owner_id text,
	relation_id text,
	timestamp timestamp,
	counter counter,
	PRIMARY KEY ((owner_id, relation_id), timestamp)
);

CREATE TABLE IF NOT EXISTS signals.signals_all (
	owner_id text,
	relation_id text,
	counter counter,
	PRIMARY KEY ((owner_id), relation_id)
);

CREATE TABLE IF NOT EXISTS signals.signals_by_id (
	relation_id text,
	owner_id text,
	counter counter,
	PRIMARY KEY ((relation_id), owner_id)
);