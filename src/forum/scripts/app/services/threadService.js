/**
 * Created by sergey on 30.07.16.
 */
(function(){

    'use strict';

    var threadRepository = require('../repositories/threadRepository');

    var getList = function(options){
        return threadRepository.getList(options);
    };

    var getByKey = function(id){
        return threadRepository.getByKey(id);
    };

    var create = function(thread){
        return threadRepository.create(thread);
    };

    var update = function(id, thread){
        return threadRepository.update(id, thread);
    };

    var deleteByKey = function(id){
        return threadRepository.deleteByKey(id);
    };


    module.exports = {
        getList: getList,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey
    }

}());