/**
 * Created by szhitenev on 20.09.2022.
 */
(function () {

    var instrumentCountryRepository = require('../../repositories/instrument/instrumentCountryRepository');

    var getList = function (options) {
        return instrumentCountryRepository.getList(options);
    };

    var getByKey = function (id) {
        return instrumentCountryRepository.getByKey(id);
    };

    module.exports = {
        getList: getList,
        getByKey: getByKey
    }


}());