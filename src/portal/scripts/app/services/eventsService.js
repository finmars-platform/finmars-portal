(function () {

    var eventsRepository = require('../repositories/eventsRepository');

    var getList = function (options) {
        return eventsRepository.getList(options);
    };

    var getEventAction = function (eventId, actionId) {
        return eventsRepository.getEventAction(eventId, actionId);
    };

    var putEventAction = function (eventId, actionId, data, status) {
        return eventsRepository.putEventAction(eventId, actionId, data, status);
    };

    var informedEventAction = function (id) {
        return eventsRepository.informedEventAction(id);
    };

    var errorEventAction = function (id, actionId, data) {
        return eventsRepository.errorEventAction(id, actionId, data);
    };

    var generateEvents = function () {
        return eventsRepository.generateEvents();
    };

    var generateEventsRange = function (options) {
        return eventsRepository.generateEventsRange(options);
    };

    var generateAndProcessAsSystem = function () {
        return eventsRepository.generateAndProcessAsSystem();
    };

    module.exports = {
        getList: getList,
        getEventAction: getEventAction,
        putEventAction: putEventAction,
        informedEventAction: informedEventAction,
        errorEventAction: errorEventAction,
        generateEvents: generateEvents,
        generateEventsRange: generateEventsRange,
        generateAndProcessAsSystem: generateAndProcessAsSystem
    }


}());