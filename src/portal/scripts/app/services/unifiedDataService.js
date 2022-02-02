/**
 * Created by szhitenev on 19.01.2022.
 */
(function () {

    var unifiedDataRepository = require('../repositories/unifiedDataRepository');

    var getList = function (entityType, options) {
        return unifiedDataRepository.getList(entityType, options);
    };

    var getConfigurationPackageGroupList = function (options) {
        return unifiedDataRepository.getConfigurationPackageGroupList(options);
    };

    var getConfigurationPackageList = function (options) {
        return unifiedDataRepository.getConfigurationPackageList(options);
    };

    var getConfigurationPackageFile = function (id) {
        return unifiedDataRepository.getConfigurationPackageFile(id)
    }

    module.exports = {
        getList: getList,
        getConfigurationPackageGroupList: getConfigurationPackageGroupList,
        getConfigurationPackageList: getConfigurationPackageList,
        getConfigurationPackageFile: getConfigurationPackageFile
    }


}());