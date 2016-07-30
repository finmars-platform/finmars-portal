/**
 * Created by sergey on 30.07.16.
 */
(function(){

    'use strict';

    var threadMessagesRepository = require('../repositories/threadMessagesRepository');

    var getList = function(options){
        return threadMessagesRepository.getList(options);
    };

    var getByKey = function(id){
        return threadMessagesRepository.getByKey(id);
    };

    var create = function(thread){
        return threadMessagesRepository.create(thread);
    };

    var update = function(id, thread){
        return threadMessagesRepository.update(id, thread);
    };

    var deleteByKey = function(id){
        return threadMessagesRepository.deleteByKey(id);
    };


    module.exports = {
        getList: getList,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey
    }

}());