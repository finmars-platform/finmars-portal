/**
 * Created by sergey on 30.07.16.
 */
// (function(){

'use strict';

// import cookieService from '../../../../core/services/cookieService';

//    module.exports = function($scope) {
import websocketService from "../../../../shell/scripts/app/services/websocketService";

export default function ($scope, $mdDialog, authorizerService, globalDataService) {
	console.log("testing profile controller initialized ", authorizerService);
	let vm = this;

	// vm.currentMasterUser = '';
	vm.masters = [];
	vm.currentMasterUser = globalDataService.getMasterUser();

	const updateCurrentMasterUser = function () {

		vm.currentMasterUser = globalDataService.getMasterUser();

		if (vm.currentMasterUser) {
			websocketService.send({action: "update_user_state", data: {master_user: vm.currentMasterUser}});
		}
		console.log("testing updateCurrentMasterUser", vm.currentMasterUser);
	};

	/* vm.logOutMethod = function () {

		$mdDialog.show({
			controller: "WarningDialogController as vm",
			templateUrl: "views/dialogs/warning-dialog-view.html",
			multiple: true,
			clickOutsideToClose: false,
			locals: {
				warning: {
					title: "Warning",
					description: "All unsaved changes of layouts in all FinMARS browser tabs will be lost!",
					actionsButtons: [
						{
							name: "CANCEL",
							response: {status: 'disagree'}
						},
						{
							name: "OK, PROCEED",
							response: {status: 'agree'}
						}
					]
				}
			}

		}).then(function (res) {

			if (res.status === 'agree') {

				if (vm.broadcastManager) {
					vm.broadcastManager.postMessage({event: crossTabEvents.LOGOUT});
				}

				middlewareService.initLogOut();

				authorizerService.logout().then(function (data) {
					console.log('Logged out');
					sessionStorage.removeItem('afterLoginEvents');

					if (window.location.pathname !== '/') {
						window.location.pathname = '/';
					} else {
						window.location.reload()
					}

					cookieService.deleteCookie('authtoken');

				});

			}

		});
	};*/
	const getMastersList = function () {

		// return usersService.getMasterList().then(function (data) {
		return new Promise(function (resolve, reject) {

			// usersService.getMasterListLight().then(function (data) {
			authorizerService.getMasterList().then(function (data) {

				if (data.hasOwnProperty('results')) {

					vm.masters = data.results;

					if (vm.masters.length) {
						updateCurrentMasterUser();
					}

				} else {
					vm.masters = []
				}

				$scope.$apply();

				resolve();

			}).catch(error => {
				reject(error);
			});

		});

	};

	const init = function () {

		getMastersList();

	};

	init();

};

// })();