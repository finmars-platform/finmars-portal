/**
 * Created by mevstratov on 27.05.2021
 */

'use strict';

import websocketService from "../../../../shell/scripts/app/services/websocketService.js";
const localStorageService = require('../../../../shell/scripts/app/services/localStorageService'); // TODO inject localStorageService into angular dependencies

export default function ($scope, authorizerService, usersService, globalDataService) {

	let vm = this;

	vm.readyStatus = false;

	const getMember = function () {

		return new Promise(function (resolve, reject) {

			usersService.getMyCurrentMember().then(function (data) {

				const member = data;

				websocketService.send({action: "update_user_state", data: {member: member}});

				resolve(member);

			}).catch(function (error) {
				console.error(error);
				reject(error);
			});

		});

	}

	const getCurrentMasterUser = function () {

		return new Promise((resolve, reject) => {

			authorizerService.getCurrentMasterUser().then(masterUser => {

				websocketService.send({action: "update_user_state", data: {master_user: masterUser}});

				resolve();

			}).catch(error => reject(error));

		});

	};

	const init = function () {

		localStorageService.setGlobalDataService(globalDataService); // TODO inject localStorageService into angular dependencies

		vm.currentMasterUser = globalDataService.getMasterUser();
		const promises = [];

		if (!vm.currentMasterUser) { // if currentMasterUser was not set previously, load it
			promises.push(getCurrentMasterUser());
		}

		promises.push(getMember());

		Promise.all(promises).then(resData => {

			vm.readyStatus = true;
			$scope.$apply();

		});

	};

	init();

};