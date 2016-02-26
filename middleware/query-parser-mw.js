var error = require('clickberry-http-errors');

exports.parseRange = function (paramName) {
    return function (req, res, next) {
        var start = new Date(req.query.start);
        var finish = new Date(req.query.finish);
        var top = parseInt(req.query.top) || 12;

        if (isNaN(start) || isNaN(finish)) {
            return next(new error.BadRequest());
        }

        req[paramName] = {
            start: start,
            finish: finish,
            top: top
        };

        next();
    };
};

exports.parseIds = function (paramName, max) {
    return function (req, res, next) {
        var idsStr = req.query.ids;
        req[paramName] = idsStr.split(',').slice(0, max);

        next();
    };
};