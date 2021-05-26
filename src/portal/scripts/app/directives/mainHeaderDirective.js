'use strict';

// const cookieService = require('../../../../core/services/cookieService');
import websocketService from "../../../../shell/scripts/app/services/websocketService";
import crossTabEvents from "../../../../shell/scripts/app/services/events/crossTabEvents.js";

export default function ($mdDialog, cookiesService, broadcastChannelService, middlewareService, authorizerService, usersService) {

	return {
		restrict: 'E',
		scope: {},
		templateUrl: 'views/directives/main-header-view.html',
		link: function (scope, elem, attrs) {
			console.log("testing mainHeaderDirective");
			// let user;
			scope.userName = '';

			let member;

			const updateCurrentMasterUser = function () {

				scope.currentMasterUser = scope.auth;

				if (scope.currentMasterUser) {
					websocketService.send({action: "update_user_state", data: {master_user: scope.currentMasterUser}});
				}
				console.log("testing updateCurrentMasterUser", scope.currentMasterUser);
			};

			const getMastersList = function () {

				// return usersService.getMasterList().then(function (data) {
				return new Promise(function (resolve, reject) {

					// usersService.getMasterListLight().then(function (data) {
					authorizerService.getMasterList().then(function (data) {

						if (data.hasOwnProperty('results')) {

							scope.masters = data.results;

							if (scope.masters.length) {
								updateCurrentMasterUser();
							}

						} else {
							scope.masters = []
						}

						scope.$apply();

						resolve();

					}).catch(error => {
						reject(error);
					});

				});

			};

			scope.logOutMethod = function () {

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

						if (broadcastChannelService.isAvailable) {
							broadcastChannelService.postMessage('finmars_broadcast', {event: crossTabEvents.LOGOUT});
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
			};

			const getMember = function () {

				return new Promise(function (resolve, reject) {

					usersService.getMyCurrentMember().then(function (data) {

						member = data;

						websocketService.send({action: "update_user_state", data: {member: member}});

						resolve(member);

					}).catch(function (error) {
						console.error(error);
						reject(error);
					});

				});

			};

			scope.selectMaster = function (master) {

				// var checkLayoutForChanges = middlewareService.getWarningOfLayoutChangesLossFn();
				const changeMasterUser = function () {

					middlewareService.masterUserChanged();

					authorizerService.setMasterUser(master.id).then(function (data) {

						if (data.base_api_url) {
							baseUrlService.setMasterUserPrefix(data.base_api_url)
						}

						// $state.go('app.home', null, {reload: 'app'});

						window.location.reload();

						if (broadcastChannelService.isAvailable) {
							broadcastChannelService.postMessage('finmars_broadcast', {event: crossTabEvents.MASTER_USER_CHANGED});
						}

						getMember()

						getMastersList();

					});
				};

				if (scope.currentMasterUser && scope.currentMasterUser.id !== master.id) {

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

							var count_cached_requests = 0;

							if (window.cached_requests) {
								count_cached_requests = Object.keys(window.cached_requests).length;
							}

							window.cached_requests = {};
							console.log('Clear Cached Requests. Total: ', count_cached_requests);

							changeMasterUser();

						}

					});

				} else {

					$state.go('app.home');

				}

			};

			const init = async function () {

				Promise.all([usersService.getMe(), getMastersList(), getMember()]).then(resData => {

					const user = resData[0];
					scope.userName = user.username;

					scope.$apply();

				});

			};

			init();

		}
	}

};