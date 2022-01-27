/**
 * Created by szhitenev on 19.01.2022.
 */
(function () {

    var unifiedDataRepository = require('../repositories/unifiedDataRepository');

    var getList = function (entityType, options) {
        return unifiedDataRepository.getList(entityType, options);
    };

    module.exports = {
        getList: getList
    }


}());