(function () {

    var eventsRepository = require('../repositories/eventsRepository');

    var getList = function () {
        return eventsRepository.getList();
    };

    var eventAction = function (eventId, options) {
        return eventsRepository.eventAction(eventId, options);
    };

    module.exports = {
        getList: getList,
        eventAction: eventAction
    }


}());