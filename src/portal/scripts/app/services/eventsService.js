(function () {

    var eventsRepository = require('../repositories/eventsRepository');

    var getList = function () {
        return eventsRepository.getList();
    };

    var getEventAction = function (url) {
        return eventsRepository.getEventAction(url);
    };

    var putEventAction = function (url, data) {
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