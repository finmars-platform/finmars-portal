(function () {

    var eventsRepository = require('../repositories/eventsRepository');

    var getList = function (options) {
        return eventsRepository.getList(options);
    };

    var getEventAction = function (eventId, actionId) {
        return eventsRepository.getEventAction(url);
    };

    var putEventAction = function (eventId, actionId, data) {
        return eventsRepository.putEventAction(url, data);
    };

    var ignoreEventAction = function (id) {
        return eventsRepository.ignoreEventAction(id);
    };

    var generateEvents = function () {
        return eventsRepository.generateEvents();
    };

    module.exports = {
        getList: getList,
        getEventAction: getEventAction,
        putEventAction: putEventAction,
        ignoreEventAction: ignoreEventAction,
        generateEvents: generateEvents
    }


}());