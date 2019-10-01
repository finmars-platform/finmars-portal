/**
 * Created by szhitenev on 09.08.2016.
 */
(function(){

    'use strict';

    var strategyRepository = require('../repositories/strategyRepository');

    var getList = function(strategyNumber, options){
        return strategyRepository.getList(strategyNumber, options);
    };

    var getByKey = function(strategyNumber, id){
        return strategyRepository.getByKey(strategyNumber, id);
    };

    var create = function(strategyNumber, strategy){
        return strategyRepository.create(strategyNumber, strategy);
    };

    var update = function(strategyNumber, id, strategy){
        return strategyRepository.update(strategyNumber, id, strategy);
    };

    var deleteByKey = function(strategyNumber, id){
        return strategyRepository.deleteByKey(strategyNumber, id);
    };

    var deleteBulk = function(strategyNumber, data){
        return strategyRepository.deleteBulk(strategyNumber, data)
    };

    module.exports = {

        getList: getList,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey,

        deleteBulk: deleteBulk

    }

}());