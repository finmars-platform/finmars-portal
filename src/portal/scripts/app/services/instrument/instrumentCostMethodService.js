/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

    var instrumentCostMethodRepository = require('../../repositories/instrument/instrumentCostMethodRepository');

    var getList = function (options) {
        return instrumentCostMethodRepository.getList(options);
    };

    module.exports = {
        getList: getList
    }


}());