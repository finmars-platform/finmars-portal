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

    module.exports = {
        getList: getList,
        getEventAction: getEventAction,
        putEventAction: putEventAction
    }


}());