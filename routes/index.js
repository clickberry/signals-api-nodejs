var express = require('express');
var config = require('clickberry-config');
var signalService = require('../lib/signals-service');
var validation = require('../middleware/validation-mw');
var queryParser = require('../middleware/query-parser-mw');
var Bus = require('../lib/bus-service');
var bus = new Bus({
    //mode: config.get('node:env'),
    address: config.get('nsqd:address'),
    port: config.get('nsqd:port')
});

var router = express.Router();

module.exports = function (passport) {
    var seriesMw = [
        passport.authenticate('access-token', {session: false, assignProperty: 'payload'}),
        passport.authenticate('relation-token', {session: false, assignProperty: 'relation'}),
        validation.checkAccess('payload', 'relation'),
        validation.checkParams('signalId', 'relation'),
        queryParser.parseRange('query')
    ];

    router.get('/heartbeat', function (req, res) {
        res.send();
    });

    router.get('/:signalId/hours',
        seriesMw,
        function (req, res, next) {
            signalService.getHours(req.relation, req.query, function (err, signals) {
                if (err) {
                    return next(err);
                }

                var signalDtos = signals.map(signalSeriesMap);
                res.send(signalDtos);
            });
        });

    router.get('/:signalId/days',
        seriesMw,
        function (req, res, next) {
            signalService.getDays(req.relation, req.query, function (err, signals) {
                if (err) {
                    return next(err);
                }

                var signalDtos = signals.map(signalSeriesMap);
                res.send(signalDtos);
            });
        });

    router.get('/:signalId/weeks',
        seriesMw,
        function (req, res, next) {
            signalService.getWeeks(req.relation, req.query, function (err, signals) {
                if (err) {
                    return next(err);
                }

                var signalDtos = signals.map(signalSeriesMap);
                res.send(signalDtos);
            });
        });

    router.get('/:signalId/months',
        seriesMw,
        function (req, res, next) {
            signalService.getMonths(req.relation, req.query, function (err, signals) {
                if (err) {
                    return next(err);
                }

                var signalDtos = signals.map(signalSeriesMap);
                res.send(signalDtos);
            });
        });

    router.get('/:signalId',
        validation.checkSignalId('signalId'),
        queryParser.parseIds('ids', 50),
        function (req, res, next) {
            signalService.getByIds(req.params.signalId, req.ids, function (err, signals) {
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
            var message = {
                id: req.relation.id,
                ownerId: req.relation.ownerId,
                userId: req.relation.userId
            };

            bus.publishSignal(message, function (err) {
                if (err) {
                    return next(err);
                }

                res.sendStatus(201);
            });
        }
    );

    return router;
};

function signalSeriesMap(signal) {
    return {
        counter: signal.counter,
        timestamp: signal.timestamp
    };
}

function signalMap(siganal) {
    return {
        ownerId: siganal.owner_id,
        relationId: siganal.relation_id,
        counter: siganal.counter
    };
}
