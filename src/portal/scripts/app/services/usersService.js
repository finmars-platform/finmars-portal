/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

    'use strict';

    let usersRepository = require('../repositories/usersRepository');

    let login = function (login, password) {
        return usersRepository.login(login, password);
    };

    let logout = function () {
        return usersRepository.logout();
    };

    let ping = function () {
        return usersRepository.ping();
    };

    let protectedPing = function () {
        return usersRepository.protectedPing();
    };

    let getList = function () {
        return usersRepository.getList();
    };

    let getByKey = function (id) {
        return usersRepository.getByKey(id)
    };

    let getMe = function () {
        return usersRepository.getMe();
    };

    let getMyCurrentMember = function () {
        return usersRepository.getMyCurrentMember();
    };

    let changePassword = function (id, user) {
        return usersRepository.changePassword(id, user);
    };

    let update = function (id, user) {
        return usersRepository.update(id, user);
    };

    let patch = function (id, user) {
        return usersRepository.patch(id, user);
    };

    let deleteByKey = function (id) {
        return usersRepository.deleteByKey(id);
    };

    let getCurrentMasterUser = function () {
        return usersRepository.getCurrentMasterUser();
    };
    
    let createMasterUser = function (user) {
        return usersRepository.createMasterUser(user);
    };

    let getMasterList = function () {
        return usersRepository.getMasterList();
    };

    let getMasterByKey = function (id) {
        return usersRepository.getMasterByKey(id)
    };

    let updateMaster = function (id, user) {
        return usersRepository.updateMaster(id, user);
    };

    let patchMaster = function (id, user) {
        return usersRepository.patchMaster(id, user);
    };

    let deleteMasterByKey = function (id) {
        return usersRepository.deleteMasterByKey(id);
    };

    let setMasterUser = function (id) {
        return usersRepository.setMasterUser(id);
    };


    let getMemberList = function () {
        return usersRepository.getMemberList();
    };

    let getMasterListLight = function () {
        return usersRepository.getMasterListLight();
    };

    let getMemberByKey = function (id) {
        return usersRepository.getMemberByKey(id)
    };

    let updateMember = function (id, user) {
        return usersRepository.updateMember(id, user);
    };

    let patchMember = function (id, user) {
        return usersRepository.patchMember(id, user);
    };

    let deleteMemberByKey = function (id) {
        return usersRepository.deleteMemberByKey(id);
    };

    let getGroupList = function () {
        return usersRepository.getGroupList();
    };

    let getOwnMemberSettings = function () {
        return usersRepository.getOwnMemberSettings();
    };

    let updateOwnMemberSettings = function (id, member) {
        return usersRepository.updateOwnMemberSettings(id, member);
    };

	let setGlobal = function () {

	};

    module.exports = {
        login: login,
        logout: logout,

        ping: ping,
        protectedPing: protectedPing,

        getList: getList,
        getByKey: getByKey,
        getMe: getMe,
        getMyCurrentMember: getMyCurrentMember,
        changePassword: changePassword,
        update: update,
        patch: patch,
        deleteByKey: deleteByKey,


        getCurrentMasterUser: getCurrentMasterUser,
        createMasterUser: createMasterUser,
        getMasterList: getMasterList,
        getMasterListLight: getMasterListLight,
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