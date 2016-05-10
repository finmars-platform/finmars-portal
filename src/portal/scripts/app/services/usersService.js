/**
 * Created by szhitenev on 04.05.2016.
 */
(function(){

    'use strict';

    var usersRepository = require('../repositories/usersRepository');

    var login = function(login, password) {
        return usersRepository.login(login, password);
    };

    var logout = function(){
        return usersRepository.logout();
    };

    var ping = function(){
        return usersRepository.ping();
    };

    var protectedPing = function(){
        return usersRepository.protectedPing();
    };

    var getList = function(){
        return usersRepository.getList();
    };

    var getByKey = function(id){
        return usersRepository.getByKey(id)
    };

    var update = function(id, user) {
        return usersRepository.update(id, user);
    };

    var patch = function(id, user) {
        return usersRepository.patch(id, user);
    };

    var deleteByKey = function(id) {
        return usersRepository.deleteByKey(id);
    };

    var getMasterList = function(){
        return usersRepository.getMasterList();
    };

    var getMasterByKey = function(id){
        return usersRepository.getMasterByKey(id)
    };

    var updateMaster = function(id, user) {
        return usersRepository.updateMaster(id, user);
    };

    var patchMaster = function(id, user) {
        return usersRepository.patchMaster(id, user);
    };

    var deleteMasterByKey = function(id) {
        return usersRepository.deleteMasterByKey(id);
    };

    var getMemberList = function(){
        return usersRepository.getMemberList();
    };

    var getMemberByKey = function(id){
        return usersRepository.getMemberByKey(id)
    };

    var updateMember = function(id, user) {
        return usersRepository.updateMember(id, user);
    };

    var patchMember = function(id, user) {
        return usersRepository.patchMember(id, user);
    };

    var deleteMemberByKey = function(id) {
        return usersRepository.deleteMemberByKey(id);
    };

    var getGroupList = function(){
        return usersRepository.getGroupList();
    };

    module.exports = {
        login: login,
        logout: logout,

        ping: ping,
        protectedPing: protectedPing,

        getList: getList,
        getByKey: getByKey,
        update: update,
        patch: patch,
        deleteByKey: deleteByKey,

        getMasterList: getMasterList,
        getMasterByKey: getMasterByKey,
        updateMaster: updateMaster,
        patchMaster: patchMaster,
        deleteMasterByKey: deleteMasterByKey,

        getMemberList: getMemberList,
        getMemberByKey: getMemberByKey,
        updateMember: updateMember,
        patchMember: patchMember,
        deleteMemberByKey: deleteMemberByKey,

        getGroupList: getGroupList
    }

}());