var util = require('util');
var Publisher=require('clickberry-nsq-publisher');

function Bus(options) {
    Publisher.call(this, options);
}

util.inherits(Bus, Publisher);

Bus.prototype.publishSignal = function (message, callback) {
    this.publish('signal-sends', message, function (err) {
        if (err) return callback(err);
        callback();
    });
};

module.exports = Bus;