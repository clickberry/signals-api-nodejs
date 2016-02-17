var config = require('clickberry-config');
var cassandra = require('cassandra-driver');
var Q = require('q');
var moment = require('moment');

var client = new cassandra.Client({
    contactPoints: config.get('cassandra:nodes').split(','),
    keyspace: config.get('cassandra:keyspace')
});

var executeAsync = Q.nbind(client.execute, client);

function create(relation, callback) {
    var hour = moment.utc().startOf('hour').valueOf();
    var day = moment.utc().startOf('day').valueOf();
    var week = moment.utc().startOf('isoWeek').valueOf();
    var month = moment.utc().startOf('month').valueOf();

    var signalAllUpdate = 'UPDATE signals_all SET counter=counter+1 WHERE owner_id=? AND relation_id=?';
    var signalByHourUpdate = createUpdateQuery('signals_by_hour');
    var signalByDayUpdate = createUpdateQuery('signals_by_day');
    var signalByWeekUpdate = createUpdateQuery('signals_by_week');
    var signalByMonthUpdate = createUpdateQuery('signals_by_month');

    var params = createParams(relation);
    var hourParams = createUpdateParams(relation, hour);
    var dayParams = createUpdateParams(relation, day);
    var weekParams = createUpdateParams(relation, week);
    var monthParams = createUpdateParams(relation, month);

    Q.all([
        executeAsync(signalAllUpdate, params, {prepare: true}),
        executeAsync(signalByHourUpdate, hourParams, {prepare: true}),
        executeAsync(signalByDayUpdate, dayParams, {prepare: true}),
        executeAsync(signalByWeekUpdate, weekParams, {prepare: true}),
        executeAsync(signalByMonthUpdate, monthParams, {prepare: true})
    ])
        .then(function (results) {
            callback(null);
        })
        .catch(function (err) {
            callback(err);
        });
}

function getHours(relation, query, callback) {
    var selectQuery = createSelectQuery('signals_by_hour');
    var params = createSelectParams(relation, query);
    client.execute(selectQuery, params, {prepare: true}, function (err, results) {
        callback(err, results.rows);
    });
}

exports.create = create;
exports.getHours = getHours;

function createUpdateQuery(tableName) {
    return 'UPDATE ' + tableName + ' SET counter=counter+1 WHERE owner_id=? AND relation_id=? AND timestamp=?';
}

function createSelectQuery(tableName) {
    return 'SELECT * FROM ' + tableName + ' WHERE owner_id=? AND relation_id=? AND timestamp>=? AND timestamp<=? LIMIT ?';
}

function createUpdateParams(relation, timestamp) {
    return [relation.ownerId, relation.id, timestamp];
}

function createParams(relation) {
    return [relation.ownerId, relation.id];
}

function createSelectParams(relation, query) {
    return [relation.ownerId, relation.id, query.start, query.finish, query.top];
}