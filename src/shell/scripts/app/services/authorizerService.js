/**
 * Created by szhitenev on 04.05.2016.
 */
// (function () {

'use strict';

import authorizerRepository from '../repositories/authorizerRepository.js';
/** @module authorizerService */
export default function (globalDataService) {

	const login = function (login, password) {
		return authorizerRepository.login(login, password);
	};

	const tokenLogin = function (login, password) {
		return authorizerRepository.tokenLogin(login, password);
	};


	const logout = function () {
		return authorizerRepository.logout();
	};

	const getUser = function () {

		return new Promise ((resolve, reject) => {

			const user = globalDataService.getUser();

			if (user) resolve(user);

			authorizerRepository.getUser().then(userData => {

				globalDataService.setUser(userData);
				resolve(userData);

			}).catch(error => {
				globalDataService.setUser(null);
				reject(error);
			});

		});

	};

	const ping = function () {
		return authorizerRepository.ping();
	};


	const getUsersList = function () {
		return authorizerRepository.getUsersList();
	};

	const getUserByKey = function (id) {
		return authorizerRepository.getUserByKey(id)
	};

	/**
	 * Updates user.
	 *
	 * @memberOf module:authorizerService
	 *
	 * @param id {number} - id of user
	 * @param user {Object} - user data
	 * @returns {Promise<any>}
	 */
	const update = function (id, user) {
		return authorizerRepository.update(id, user);
	};

	/**
	 * Updates properties of user object.
	 *
	 * @memberOf module:authorizerService
	 *
	 * @param id {number} - id of user
	 * @param user {Object} - user data
	 * @returns {Promise<any>}
	 */
	const patchUser = function (id, user) {
		return authorizerRepository.patch(id, user);
	};

	const deleteByKey = function (id) {
		return authorizerRepository.deleteByKey(id);
	};


	const createMasterUser = function (user) {
		return authorizerRepository.createMasterUser(user);
	};

	const getMasterList = function () {
		return authorizerRepository.getMasterList();
	};

	const getMasterByKey = function (id) {
		return authorizerRepository.getMasterByKey(id)
	};

	const getCurrentMasterUser = function () {
		return globalDataService.getMasterUser();
	};

	const updateMaster = function (id, user) {

		return new Promise()
		return authorizerRepository.updateMaster(id, user);
	};

	const setMasterUser = function (id) {
		// return authorizerRepository.setMasterUser(id);
		return new Promise((resolve, reject) => {

			authorizerRepository.setMasterUser(id).then(function (masterUserData) {

				globalDataService.setMasterUser(masterUserData);

				globalDataService.setMember(null);

				resolve(masterUserData);
				/* getUserPromise().then(memberData => {
					globalDatabaseService.setMember(memberData);
				});

				getMemberPromise().then(memberData => {
					globalDatabaseService.setMember(memberData);
				}); */

			}).catch(error => reject(error));

		});

	};

	const getMasterListLight = function () {
		return authorizerRepository.getMasterListLight();
	};

	const inviteUser = function (data) {
		return authorizerRepository.inviteUser(data);
	};

	const getInvitesList = function(options){
		return authorizerRepository.getInvitesList(options);
	};

	const deleteInviteByKey = function(id) {
		return authorizerRepository.deleteInviteByKey(id)
	};

	return {
		tokenLogin: tokenLogin,
		login: login,
		logout: logout,

		getUser: getUser,

		ping: ping,

		getUsersList: getUsersList,
		getUserByKey: getUserByKey,

		update: update,
		patchUser: patchUser,
		deleteByKey: deleteByKey,

		createMasterUser: createMasterUser,
		getMasterList: getMasterList,
		getMasterListLight: getMasterListLight,
		getMasterByKey: getMasterByKey,
		getCurrentMasterUser: getCurrentMasterUser,
		updateMaster: updateMaster,

		setMasterUser: setMasterUser,

		inviteUser: inviteUser,
		getInvitesList: getInvitesList,
		deleteInviteByKey: deleteInviteByKey

	}

};

// })();