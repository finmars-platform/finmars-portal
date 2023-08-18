/**
 * Created by szhitenev on 22.04.2022.
 */
(function () {

    var currencyDatabaseSearchRepository = require('../../repositories/currency/currencyDatabaseSearchRepository');

    var getList = function (name, page) {
        return currencyDatabaseSearchRepository.getList(name, page);
    };


    module.exports = {
        getList: getList
    }


}());