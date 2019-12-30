/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

    var fileReportsRepository = require('../repositories/fileReportsRepository');

    var getList = function (options) {
        return fileReportsRepository.getList(options);
    };

    var getByKey = function (id) {
        return fileReportsRepository.getByKey(id);
    };

    var deleteByKey = function (id) {
        return fileReportsRepository.deleteByKey(id);
    };

    module.exports = {
        getList: getList,
        getByKey: getByKey,
        deleteByKey: deleteByKey
    }


}());