/**
 * Created by sergey on 30.07.16.
 */
(function(){

    'use strict';

    var threadGroupRepository = require('../repositories/threadGroupRepository');

    var getList = function(options){
        return threadGroupRepository.getList(options);
    };

    var getByKey = function(id){
        return threadGroupRepository.getByKey(id);
    };

    var create = function(thread){
        return threadGroupRepository.create(thread);
    };

    var update = function(id, thread){
        return threadGroupRepository.update(id, thread);
    };

    var deleteByKey = function(id){
        return threadGroupRepository.deleteByKey(id);
    };


    module.exports = {
        getList: getList,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey
    }

}());