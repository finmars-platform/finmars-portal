/**
 * Created by szhitenev on 04.05.2016.
 */
// (function () {


'use strict';

import usersRepository from '../repositories/usersRepository.js';
import authorizerRepository from "../repositories/authorizerRepository";
/** @module usersService */
export default function (globalDataService) {

    // const usersRepository = require('../repositories/usersRepository');

    /* const login = function (login, password) {
        return usersRepository.login(login, password);
    };

    const logout = function () {
        return usersRepository.logout();
    }; */

    const ping = function () {
        return usersRepository.ping();
    };

	const protectedPing = function () {
        return usersRepository.protectedPing();
    };

    const getList = function () {
        return usersRepository.getList();
    };

    const getByKey = function (id) {
        return usersRepository.getByKey(id)
    };
	/**
	 * Gets current user.
	 *
	 * @memberOf module:usersService
	 * @returns {Promise<Object>} - data of current user
	 */
    const getMe = function () {

    	return new Promise ((resolve, reject) => {

			const user = globalDataService.getUser();

			if (user) resolve(user);

			usersRepository.getUser().then(userData => {

				globalDataService.setUser(userData);
				resolve(userData);

			}).catch(error => reject(error));

		});

        // return usersRepository.getMe();
    };

    const getMyCurrentMember = function () {

    	return new Promise((resolve, reject) => {

    		const member = globalDataService.getMember();
    		if (member) resolve(member);

    		usersRepository.getMyCurrentMember().then(memberData => {
    			globalDataService.setMember(memberData);
				resolve(memberData);

			}).catch(error => reject(error));

		});

    };

    const changePassword = function (id, user) {
        return usersRepository.changePassword(id, user);
    };

    const update = function (id, user) {
        return usersRepository.update(id, user);
    };

    const patch = function (id, user) {
        return usersRepository.patch(id, user);
    };

    const deleteByKey = function (id) {
        return usersRepository.deleteByKey(id);
    };

    const getCurrentMasterUser = function () {
        return usersRepository.getCurrentMasterUser();
    };
    
    const createMasterUser = function (user) {
        return usersRepository.createMasterUser(user);
    };

    const getMasterList = function () {
        return usersRepository.getMasterList();
    };

    const getMasterByKey = function (id) {
        return usersRepository.getMasterByKey(id)
    };

    const updateMaster = function (id, user) {
        return usersRepository.updateMaster(id, user);
    };

    const patchMaster = function (id, user) {
        return usersRepository.patchMaster(id, user);
    };

    const deleteMasterByKey = function (id) {
        return usersRepository.deleteMasterByKey(id);
    };

    const setMasterUser = function (id) {
        return usersRepository.setMasterUser(id);
    };


    const getMemberList = function () {
        return usersRepository.getMemberList();
    };

    const getMasterListLight = function () {
        return usersRepository.getMasterListLight();
    };

    const getMemberByKey = function (id) {
        return usersRepository.getMemberByKey(id)
    };

    const updateMember = function (id, user) {
        return usersRepository.updateMember(id, user);
    };

    const patchMember = function (id, user) {
        return usersRepository.patchMember(id, user);
    };

    const deleteMemberByKey = function (id) {
        return usersRepository.deleteMemberByKey(id);
    };

    const getGroupList = function () {
        return usersRepository.getGroupList();
    };

    const getOwnMemberSettings = function () {
        return usersRepository.getOwnMemberSettings();
    };

    const updateOwnMemberSettings = function (id, member) {
        return usersRepository.updateOwnMemberSettings(id, member);
    };


    const getUsercodePrefixList = function () {
        return usersRepository.getUsercodePrefixList();
    };

    const createUsercodePrefix = function (item) {
        return usersRepository.createUsercodePrefix(item);
    };

    const deleteUserCodePrefixByKey = function (id) {
        return usersRepository.deleteUserCodePrefixByKey(id);
    };

    // module.exports = {
	return {
		/* login: login,
		logout: logout, */
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
		updateOwnMemberSettings: updateOwnMemberSettings,

		getUsercodePrefixList: getUsercodePrefixList,
		createUsercodePrefix: createUsercodePrefix,
		deleteUserCodePrefixByKey: deleteUserCodePrefixByKey
	}

};
// }());