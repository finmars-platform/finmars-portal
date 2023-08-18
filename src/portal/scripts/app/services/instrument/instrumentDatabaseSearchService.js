/**
 * Created by szhitenev on 10.11.2021.
 */
(function () {

    var instrumentDatabaseSearchRepository = require('../../repositories/instrument/instrumentDatabaseSearchRepository');

    var getList = function (name, options) {
        return instrumentDatabaseSearchRepository.getList(name, options);
    };


    module.exports = {
        getList: getList
    }


}());