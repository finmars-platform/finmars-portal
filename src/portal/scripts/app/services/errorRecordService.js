/**
 * Created by szhitenev on 15.12.2022.
 */
(function () {

    var errorRecordRepository = require('../repositories/errorRecordRepository');

    var getList = function (options) {
        return errorRecordRepository.getList(options);
    };

    module.exports = {
        getList: getList,

    }


}());