/**
 * Created by szhitenev on 30.10.2020.
 */
(function () {

    var systemMessageRepository = require('../repositories/systemMessageRepository');

    var getList = function (options) {
        return systemMessageRepository.getList(options);
    };

    var getByKey = function (id) {
        return systemMessageRepository.getByKey(id);
    };

    var update = function(id, account) {
        return systemMessageRepository.update(id, account);
    };

    module.exports = {
        getList: getList,
        getByKey: getByKey,
        update: update
    }


}());