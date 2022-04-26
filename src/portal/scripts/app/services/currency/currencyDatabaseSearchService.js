/**
 * Created by szhitenev on 22.04.2022.
 */
(function () {

    var currencyDatabaseSearchRepository = require('../../repositories/currency/currencyDatabaseSearchRepository');

    var getList = function (name, page, instrument_type) {
        return currencyDatabaseSearchRepository.getList(name, page, instrument_type);
    };


    module.exports = {
        getList: getList
    }


}());