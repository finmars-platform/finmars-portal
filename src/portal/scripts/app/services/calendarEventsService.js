/**
 * Created by szhitenev on 19.10.2022.
 */
(function () {

    var calendarEventsRepository = require('../repositories/calendarEventsRepository');

    var getList = function (date_from, date_to) {
        return calendarEventsRepository.getList(date_from, date_to);
    };

    module.exports = {
        getList: getList,

    }


}());