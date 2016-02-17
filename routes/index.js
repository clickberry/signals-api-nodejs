var express = require('express');
var config = require('clickberry-config');
var signalService = require('../lib/signals-service');
var validation = require('../middleware/validation-mw');
var queryParser = require('../middleware/query-parser-mw');
var Bus = require('../lib/bus-service');
var bus = new Bus({
    mode: config.get('node:env'),
    address: config.get('nsqd:address'),
    port: config.get('nsqd:port')
});


var router = express.Router();

module.exports = function (passport) {
    router.get('/heartbeat', function (req, res) {
        res.send();
    });

    router.get('/:signalId/hour',
        passport.authenticate('access-token', {session: false, assignProperty: 'payload'}),
        passport.authenticate('relation-token', {session: false, assignProperty: 'relation'}),
        validation.checkAccess('payload', 'relation'),
        validation.checkParams('signalId', 'relation'),
        queryParser('query'),
        function (req, res, next) {
            signalService.getHours(req.relation, req.query, function (err, signals) {
                if (err) {
                    return next(err);
                }

                var signalDtos = signals.map(signalMap);
                res.send(signalDtos);
            });
        });

    router.post('/:signalId',
        passport.authenticate('relation-token', {session: false, assignProperty: 'relation'}),
        validation.checkParams('signalId', 'relation'),
        function (req, res, next) {
            signalService.create(req.relation, function (err) {
                if (err) {
                    return next(err);
                }

                res.sendStatus(201);
            });
        }
    );

    return router;
};

function signalMap(signal) {
    return {
        counter: signal.counter,
        timestamp: signal.timestamp
    };
}

