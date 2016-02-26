var error = require('clickberry-http-errors');
var config = require('clickberry-config');

exports.checkAccess = function (accessPayloadName, relationPayloadName) {
    return function (req, res, next) {
        var accessPayload = req[accessPayloadName];
        var relationPayload = req[relationPayloadName];

        if (accessPayload.id != relationPayload.userId) {
            return next(new error.Forbidden());
        }

        next();
    };
};

exports.checkParams = function (paramName, relationPayloadName) {
    return function (req, res, next) {
        var param = req.params[paramName];
        var relationPayload = req[relationPayloadName];

        if (param != relationPayload.id) {
            return next(new error.NotFound());
        }

        next();
    };
};

exports.checkSignalId = function (paramName) {
    var allowedIds = config.getArray('signal:allowed');
    return function (req, res, next) {
        var isAllow = allowedIds.some(function (item) {
            return item == req.params[paramName];
        });

        if (isAllow) {
            next();
        } else {
            next(new error.Forbidden());
        }
    };
};