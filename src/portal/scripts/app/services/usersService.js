/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

    'use strict';

    var usersRepository = require('../repositories/usersRepository');

    var login = function (login, password) {
        return usersRepository.login(login, password);
    };

    var logout = function () {
        return usersRepository.logout();
    };

    var ping = function () {
        return usersRepository.ping();
    };

    var protectedPing = function () {
        return usersRepository.protectedPing();
    };

    var getList = function () {
        return usersRepository.getList();
    };

    var getByKey = function (id) {
        return usersRepository.getByKey(id)
    };

    var getMe = function () {
        return usersRepository.getMe();
    };

    var changePassword = function (id, user) {
        return usersRepository.changePassword(id, user);
    };

    var update = function (id, user) {
        return usersRepository.update(id, user);
    };

    var patch = function (id, user) {
        return usersRepository.patch(id, user);
    };

    var deleteByKey = function (id) {
        return usersRepository.deleteByKey(id);
    };


    var createMasterUser = function (user) {
        return usersRepository.createMasterUser(user);
    };

    var getMasterList = function () {
        return usersRepository.getMasterList();
    };

    var getMasterByKey = function (id) {
        return usersRepository.getMasterByKey(id)
    };

    var updateMaster = function (id, user) {
        return usersRepository.updateMaster(id, user);
    };

    var patchMaster = function (id, user) {
        return usersRepository.patchMaster(id, user);
    };

    var deleteMasterByKey = function (id) {
        return usersRepository.deleteMasterByKey(id);
    };

    var setMasterUser = function (id) {
        return usersRepository.setMasterUser(id);
    };


    var getMemberList = function () {
        return usersRepository.getMemberList();
    };

    var getMemberByKey = function (id) {
        return usersRepository.getMemberByKey(id)
    };

    var updateMember = function (id, user) {
        return usersRepository.updateMember(id, user);
    };

    var patchMember = function (id, user) {
        return usersRepository.patchMember(id, user);
    };

    var deleteMemberByKey = function (id) {
        return usersRepository.deleteMemberByKey(id);
    };

    var getGroupList = function () {
        return usersRepository.getGroupList();
    };

    var getOwnMemberSettings = function () {
        return usersRepository.getOwnMemberSettings();
    };

    var updateOwnMemberSettings = function (id, member) {
        return usersRepository.updateOwnMemberSettings(id, member);
    };

    module.exports = {
        login: login,
        logout: logout,

        ping: ping,
        protectedPing: protectedPing,

        getList: getList,
        getByKey: getByKey,
        getMe: getMe,
        changePassword: changePassword,
        update: update,
        patch: patch,
        deleteByKey: deleteByKey,


        createMasterUser: createMasterUser,
        getMasterList: getMasterList,
        getMasterByKey: getMasterByKey,
        updateMaster: updateMaster,
        patchMaster: patchMaster,
        deleteMasterByKey: deleteMasterByKey,
        setMasterUser: setMasterUser,

        getMemberList: getMemberList,
        getMemberByKey: getMemberByKey,
        updateMember: updateMember,
        patchMember: patchMember,
        deleteMemberByKey: deleteMemberByKey,

        getGroupList: getGroupList,

        getOwnMemberSettings: getOwnMemberSettings,
        updateOwnMemberSettings: updateOwnMemberSettings
    }

}());