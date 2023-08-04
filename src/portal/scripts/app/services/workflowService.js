/**
 * Created by szhitenev on 12.02.2023.
 */
(function () {

    var workflowRepository = require('../repositories/workflowRepository');

    var getList = function (options) {
        return workflowRepository.getList(options);
    };

    var getByKey = function (id) {
        return workflowRepository.getByKey(id);
    };

    var executeCode = function (data) {
        return workflowRepository.executeCode(data);
    }


    module.exports = {
        getList: getList,
        getByKey: getByKey,
        executeCode: executeCode
    }


}());