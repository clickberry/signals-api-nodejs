var error = require('clickberry-http-errors');

module.exports = function (paramName) {
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