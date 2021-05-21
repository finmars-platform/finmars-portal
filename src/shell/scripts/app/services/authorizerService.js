/**
 * Created by szhitenev on 04.05.2016.
 */
// (function () {

    'use strict';

    import authorizerRepository from '../repositories/authorizerRepository.js';

    export default function authorizerService () {

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
			return authorizerRepository.getUser();

		};

		const ping = function () {
			return authorizerRepository.ping();
		};



		const getList = function () {
			return authorizerRepository.getList();
		};

		const getByKey = function (id) {
			return authorizerRepository.getByKey(id)
		};





		const update = function (id, user) {
			return authorizerRepository.update(id, user);
		};

		const patch = function (id, user) {
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

		const updateMaster = function (id, user) {
			return authorizerRepository.updateMaster(id, user);
		};



		const setMasterUser = function (id) {

			return authorizerRepository.setMasterUser(id);
			/*
			authorizerRepository.setMasterUser(id).then(function (masterUserData) {

				globalDatabaseService.setMasterUser(masterUserData);

				getUserPromise().then(memberData => {
					globalDatabaseService.setMember(memberData);
				});

				getMemberPromise().then(memberData => {
					globalDatabaseService.setMember(memberData);
				});

			});
			 */
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

	}

// })();