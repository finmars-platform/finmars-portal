/**
 * Created by szhitenev on 10.11.2021.
 */
(function () {

    var instrumentDatabaseSearchRepository = require('../../repositories/instrument/instrumentDatabaseSearchRepository');

    var getList = function (name, page, instrument_type) {
        return instrumentDatabaseSearchRepository.getList(name, page, instrument_type);
    };


    module.exports = {
        getList: getList
    }


}());