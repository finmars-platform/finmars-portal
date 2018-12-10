(function () {

    var eventsRepository = require('../repositories/eventsRepository');

    var getList = function (options) {
        return eventsRepository.getList(options);
    };

    var getEventAction = function (eventId, actionId) {
        return eventsRepository.getEventAction(eventId, actionId);
    };

    var putEventAction = function (eventId, actionId, data) {
        return eventsRepository.putEventAction(eventId, actionId, data);
    };

    var ignoreEventAction = function (id) {
        return eventsRepository.ignoreEventAction(id);
    };

    var generateEvents = function () {
        return eventsRepository.generateEvents();
    };

    var generateEventsRange = function (options) {
        return eventsRepository.generateEventsRange(options);
    };

    module.exports = {
        getList: getList,
        getEventAction: getEventAction,
        putEventAction: putEventAction,
        ignoreEventAction: ignoreEventAction,
        generateEvents: generateEvents,
        generateEventsRange: generateEventsRange
    }


}());