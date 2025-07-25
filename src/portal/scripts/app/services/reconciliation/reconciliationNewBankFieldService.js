/**
 * Created by szhitenev on 10.12.2019.
 */
(function(){

    var reconciliationNewBankFieldRepository = require('../../repositories/reconciliation/reconciliationNewBankFieldRepository');

    var getList = function (options) {
        return reconciliationNewBankFieldRepository.getList(options);
    };

    var getByKey = function (id) {
        return reconciliationNewBankFieldRepository.getByKey(id);
    };

    var create = function(account) {
        return reconciliationNewBankFieldRepository.create(account);
    };

    var update = function(id, account) {
        return reconciliationNewBankFieldRepository.update(id, account);
    };

    var deleteByKey = function (id) {
        return reconciliationNewBankFieldRepository.deleteByKey(id);
    };

    module.exports = {
        getList: getList,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey
    }

}());