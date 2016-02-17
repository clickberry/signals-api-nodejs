var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;

var config = require('clickberry-config');
var error = require('clickberry-http-errors');

module.exports = function (passport) {
    passport.use('access-token', new JwtStrategy({
        secretOrKey: config.get('token:accessSecret'),
        jwtFromRequest: ExtractJwt.fromAuthHeader()
    }, function (jwtPayload, done) {
        done(null, jwtPayload);
    }));

    passport.use('relation-token', new JwtStrategy({
        secretOrKey: config.get('token:relationSecret'),
        jwtFromRequest: ExtractJwt.fromHeader('relation-token'),
        passReqToCallback: true
    }, function (req, jwtPayload, done) {
        done(null, jwtPayload);
    }));
};