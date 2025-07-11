/**
 * Created by szhitenev on 23.06.2022.
 */
(function () {

    'use strict';

    var expressionProcedureRepository = require('../../repositories/procedures/expressionProcedureRepository');

    var getList = function (options) {
        return expressionProcedureRepository.getList(options);
    };

    var getByKey = function (id) {
        return expressionProcedureRepository.getByKey(id);
    };

    var create = function (account) {
        return expressionProcedureRepository.create(account);
    };

    var update = function (id, account) {
        return expressionProcedureRepository.update(id, account);
    };

    var deleteByKey = function (id) {
        return expressionProcedureRepository.deleteByKey(id);
    };

    var runProcedure = function (id, data) {
        return expressionProcedureRepository.runProcedure(id, data);
    };

    module.exports = {

        getList: getList,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey,

        runProcedure: runProcedure
    }

}());