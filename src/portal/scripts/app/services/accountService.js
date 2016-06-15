/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

    var accountRepository = require('../repositories/accountRepository');

    var getList = function () {
        return accountRepository.getList();
    };

    var getByKey = function (id) {
        return accountRepository.getByKey(id);
    };

    var create = function(account) {
        return accountRepository.create(account);
    };

    var update = function(id, account) {
        return accountRepository.update(id, account);
    };

    var deleteByKey = function (id) {
        return accountRepository.deleteByKey(id);
    };


    module.exports = {
        getList: getList,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey
    }


}());