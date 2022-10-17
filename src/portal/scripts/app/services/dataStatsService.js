/**
 * Created by szhitenev on 15.10.2022.
 */
(function () {

    var dataStatsRepository = require('../repositories/dataStatsRepository');

    var getStats = function (period) {
        return dataStatsRepository.getStats(period);
    };

    module.exports = {
        getStats: getStats,

    }


}());