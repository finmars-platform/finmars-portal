/**
 * Created by szhitenev on 04.05.2016.
 */
// (function () {


'use strict';

import UsersRepository from '../repositories/usersRepository.js';
import explorerService from "../../../../portal/scripts/app/services/explorerService";
// import authorizerRepository from "../repositories/authorizerRepository";
/** @module usersService */
export default function (cookieService, globalDataService, xhrService) {

	const usersRepository = new UsersRepository(cookieService, xhrService);
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

    /* const getMe = function () {

    	return new Promise ((resolve, reject) => {

			usersRepository.getMe().then(userData => {

				globalDataService.setUser(userData);
				resolve(userData);

			}).catch(error => reject(error));

		});

        // return usersRepository.getMe();
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

	const getMasterListLight = function () {
			return usersRepository.getMasterListLight();
	}; */
	const getMyCurrentMember = function () {

		/**
		 * Function globalDataService.setTheme change `user` inside globalDataService
		 *
		 * @param userData
		 * @return {Promise<*>}
		 */
		const getTheme = async function (member) {

			// memberLayout.data.theme = 'com.finmars.default-theme' // for debug

			if (!member.data.theme) { // if no theme selected, use default one
				globalDataService.setTheme('com.finmars.base-theme');
				return globalDataService.getUser();
			}

			// User selected specific theme

			const themePath = member.data.theme.split('.').join('/');
			const itemPath = `.system/ui/themes/${themePath}/theme.css`;

			try {

				const blob = await explorerService.viewFile(itemPath);

				const reader = new FileReader();

				reader.addEventListener("loadend", function (e) {

					var styleElement = document.createElement('style');
					styleElement.textContent = reader.result;

					document.head.appendChild(styleElement);

				});

				reader.readAsText(blob);

			} catch (error) {
				console.error("[portalController loadTheme] Could not fetch theme", error);
				globalDataService.setTheme('com.finmars.base-theme')
			}

			return member

		}

		/**
		 * Functions globalDataService.enableThemeDarkMode and globalDataService.disableThemeDarkMode
		 * change `user` inside globalDataService
		 *
		 * @param member
		 * @return {Promise<*>} - user with filled properties related to theme
		 */
		const applyTheme = async function (member) {

			member = await getTheme(member);

			if (typeof member.data.dark_mode !== 'boolean') {

				if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
					// Dark mode preferred
					globalDataService.enableThemeDarkMode()
				} else {
					globalDataService.disableThemeDarkMode()
					// Light mode preferred
				}

			} else if (member.data.dark_mode === true) {
				globalDataService.enableThemeDarkMode()
			} else {
				globalDataService.disableThemeDarkMode()
			}

			return member;

		}


		return new Promise((resolve, reject) => {

			usersRepository.getMyCurrentMember().then(memberData => {

				if (!memberData.data) {
					memberData.data = {};
				}

				if (!memberData.data.favorites) {
					memberData.data.favorites = {};
				}

				/*if (memberData.data.autosave_layouts !== 'boolean') {
					memberData.data.autosave_layouts = true;
				}*/

				if (!memberData.data.favorites.transaction_type) {
					memberData.data.favorites.transaction_type = [];
				}

				if (!memberData.data.favorites.attributes) {
					memberData.data.favorites.attributes = {};
				}

				memberData = applyTheme(memberData);

				globalDataService.setMember(memberData);
				resolve(memberData);

			}).catch(error => reject(error));

		});

	};

    const getMemberList = function () {
        return usersRepository.getMemberList();
    };

    const getMemberByKey = function (id) {
        return usersRepository.getMemberByKey(id)
    };

    const updateMember = function (id, member) {

    	return new Promise((resolve, reject) => {

			usersRepository.updateMember(id, member).then(updatedMember => {

				globalDataService.setMember(updatedMember);
				resolve(updatedMember);

			}).catch(error => reject(error));

		});

    };

    const patchMember = function (id, member) {

		return new Promise((resolve, reject) => {

			usersRepository.patchMember(id, member).then(patchedMember => {

				globalDataService.setMember(patchedMember);
				resolve(patchedMember);

			}).catch(error => reject(error));

		});

    };

    const deleteMemberByKey = function (id) {

    	return new Promise((resolve, reject) => {

			usersRepository.deleteMemberByKey(id).then(() => {

				const currentMember = globalDataService.getMember();
				const currentMemberIsDeleted = currentMember && currentMember.id === id;

				if (currentMemberIsDeleted) globalDataService.setMember(null);

				resolve('member is deleted');

			}).catch(error => reject(error));

		})

    };

    /* const getGroupList = function () {
        return usersRepository.getGroupList();
    }; */

    /* const getOwnMemberSettings = function () {
        return usersRepository.getOwnMemberSettings();
    }; */

    const updateOwnMemberSettings = function (id, member) {
        return usersRepository.updateOwnMemberSettings(id, member);
    };

	// TODO: move operations with usercode prefixes to separate service
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
		/* getMe: getMe,
		getCurrentUser: getCurrentUser,

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
		setMasterUser: setMasterUser, */

		getMyCurrentMember: getMyCurrentMember,
		getMemberList: getMemberList,
		getMemberByKey: getMemberByKey,
		updateMember: updateMember,
		patchMember: patchMember,
		deleteMemberByKey: deleteMemberByKey,

		// getGroupList: getGroupList,

		// getOwnMemberSettings: getOwnMemberSettings,
		updateOwnMemberSettings: updateOwnMemberSettings,

		getUsercodePrefixList: getUsercodePrefixList,
		createUsercodePrefix: createUsercodePrefix,
		deleteUserCodePrefixByKey: deleteUserCodePrefixByKey
	}

};
// }());