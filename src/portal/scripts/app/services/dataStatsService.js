/**
 * Created by szhitenev on 15.10.2022.
 */
(function () {

    var dataStatsRepository = require('../repositories/dataStatsRepository');

    var getStats = function (path) {
        return dataStatsRepository.getStats(path);
    };

    module.exports = {
        getStats: getStats,

    }


}());