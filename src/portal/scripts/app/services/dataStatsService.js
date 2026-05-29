import dataStatsRepository from '../repositories/dataStatsRepository';

var getStats = function (period) {
    return dataStatsRepository.getStats(period);
};

export default {
    getStats: getStats,

};