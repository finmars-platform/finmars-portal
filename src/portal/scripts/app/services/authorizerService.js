/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

    'use strict';

    let authorizerRepository = require('../repositories/authorizerRepository');

    let login = function (login, password) {
        return authorizerRepository.login(login, password);
    };

    let tokenLogin = function (login, password) {
        return authorizerRepository.tokenLogin(login, password);
    };



    let logout = function () {
        return authorizerRepository.logout();
    };


    let getUser = function () {
        return authorizerRepository.getUser();
    };

    let ping = function () {
        return authorizerRepository.ping();
    };



    let getList = function () {
        return authorizerRepository.getList();
    };

    let getByKey = function (id) {
        return authorizerRepository.getByKey(id)
    };





    let update = function (id, user) {
        return authorizerRepository.update(id, user);
    };

    let patch = function (id, user) {
        return authorizerRepository.patch(id, user);
    };

    let deleteByKey = function (id) {
        return authorizerRepository.deleteByKey(id);
    };


    
    let createMasterUser = function (user) {
        return authorizerRepository.createMasterUser(user);
    };

    let getMasterList = function () {
        return authorizerRepository.getMasterList();
    };

    let getMasterByKey = function (id) {
        return authorizerRepository.getMasterByKey(id)
    };

    let updateMaster = function (id, user) {
        return authorizerRepository.updateMaster(id, user);
    };



    let setMasterUser = function (id) {
        return authorizerRepository.setMasterUser(id);
    };



    let getMasterListLight = function () {
        return authorizerRepository.getMasterListLight();
    };

    var inviteUser = function (data) {
        return authorizerRepository.inviteUser(data);
    };

    var getInvitesList = function(options){
        return authorizerRepository.getInvitesList(options);
    };

    var deleteInviteByKey = function(id) {
        return authorizerRepository.deleteInviteByKey(id)
    };


    module.exports = {
        tokenLogin: tokenLogin,
        login: login,
        logout: logout,

        getUser: getUser,

        ping: ping,

        getList: getList,
        getByKey: getByKey,

        update: update,
        patch: patch,
        deleteByKey: deleteByKey,

        createMasterUser: createMasterUser,
        getMasterList: getMasterList,
        getMasterListLight: getMasterListLight,
        getMasterByKey: getMasterByKey,
        updateMaster: updateMaster,

        setMasterUser: setMasterUser,

        inviteUser: inviteUser,
        getInvitesList: getInvitesList,
        deleteInviteByKey: deleteInviteByKey


    }

}());