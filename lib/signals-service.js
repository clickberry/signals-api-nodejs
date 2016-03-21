var config = require('clickberry-config');
var cassandra = require('cassandra-driver');

var client = new cassandra.Client({
    contactPoints: config.getArray('cassandra:nodes'),
    keyspace: config.get('cassandra:keyspace'),
    queryOptions: {
        consistency: cassandra.types.quorum,
        prepare: true
    }
});

exports.getHours = function (relation, query, callback) {
    getSeries('signals_by_hour', relation, query, callback);
};

exports.getDays = function (relation, query, callback) {
    getSeries('signals_by_day', relation, query, callback);
};

exports.getWeeks = function (relation, query, callback) {
    getSeries('signals_by_week', relation, query, callback);
};

exports.getMonths = function (relation, query, callback) {
    getSeries('signals_by_month', relation, query, callback);
};

exports.getByIds = function (signalId, ids, callback) {
    var selectQuery = createByIdQuery(ids);

    client.execute(selectQuery, [signalId], function (err, result) {
        if (err) {
            return callback(err);
        }

        callback(null, result.rows)
    });
};

function getSeries(tableName, relation, query, callback) {
    var selectQuery = createSeriesQuery(tableName);
    var params = createSeriesParams(relation, query);
    client.execute(selectQuery, params, function (err, result) {
        if (err) {
            return callback(err);
        }

        callback(null, result.rows)
    });
}

function createSeriesQuery(tableName) {
    return 'SELECT * FROM ' + tableName + ' WHERE owner_id=? AND relation_id=? AND timestamp>=? AND timestamp<=? LIMIT ?';
}

function createSeriesParams(relation, query) {
    return [relation.ownerId, relation.id, query.start, query.finish, query.top];
}

function createByIdQuery(ids) {
    var idsStr = ids.map(function (id) {
        return '\'' + id + '\'';
    }).join(',');

    return 'SELECT * FROM signals_by_id WHERE relation_id=? AND owner_id IN (' + idsStr + ')';
}