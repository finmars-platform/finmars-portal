'use strict';

// const cookieService = require('../../../../core/services/cookieService');
import websocketService from "../../../../shell/scripts/app/services/websocketService.js";
import crossTabEvents from "../../../../shell/scripts/app/services/events/crossTabEvents.js";
import baseUrlService from "../../../../shell/scripts/app/services/baseUrlService.js";

const metaService = require('../services/metaService'); // TODO inject into angular dependencies

export default function ($mdDialog, $state, $transitions, cookieService, broadcastChannelService, middlewareService, authorizerService, globalDataService) {

	return {
		restrict: 'E',
		scope: {
			openedInside: '@' // ('profile', 'portal')
		},
		templateUrl: 'views/directives/main-header-view.html',
		link: function (scope, elem, attrs) {

			if (!scope.openedInside) throw new Error("mainHeaderDirective: openedInside does not set");
			// let user;
			scope.currentLocation = '';
			scope.currentMasterUser = globalDataService.getMasterUser();
			scope.userName = '';

			let deregisterOnSuccessTransitionHook;

			const mdContent = document.querySelector('md-content');

			const updateCurrentMasterUser = function () {

				scope.currentMasterUser = globalDataService.getMasterUser();

				if (scope.currentMasterUser) {
					websocketService.send({action: "update_user_state", data: {master_user: scope.currentMasterUser}});
				}

			};

			const getMasterUsersList = function () {

				// return usersService.getMasterList().then(function (data) {
				return new Promise(function (resolve, reject) {

					// usersService.getMasterListLight().then(function (data) {
					authorizerService.getMasterUsersList().then(function (data) {

						if (data.hasOwnProperty('results')) {

							scope.masterUsers = data.results;

							if (scope.masterUsers.length) {
								updateCurrentMasterUser();
							}

						} else {
							scope.masterUsers = []
						}

						scope.$apply();

						resolve();

					}).catch(error => {
						reject(error);
					});

				});

			};

			scope.toggleBookmarksPanel = function () {

				mdContent.classList.add('overflow-hidden');

				scope.showBookmarks = !scope.showBookmarks;

				setTimeout(function () {
					mdContent.classList.remove('overflow-hidden');
				}, 100);

			};

			scope.openHelp = function ($event) {

				var urlPieces = $state.current.url.split('/');
				var destinationUrl = urlPieces[urlPieces.length - 1].replace('-', '_');

				var helpPageUrl = destinationUrl + '.html';

				$mdDialog.show({
					controller: 'HelpDialogController as vm',
					templateUrl: 'views/dialogs/help-dialog-view.html',
					targetEvent: $event,
					locals: {
						data: {
							helpPageUrl: helpPageUrl
						}
					},
					multiple: true,
					preserveScope: true,
					autoWrap: true,
					skipHide: true
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

							cookieService.deleteCookie('authtoken');
							cookieService.deleteCookie('csrftoken');

							sessionStorage.removeItem('afterLoginEvents');

							/* if (window.location.pathname !== '/') {
								window.location.pathname = '/';
							} else {
								window.location.reload()
							} */
							$state.go('app.authentication');

							// cookieService.deleteCookie('authtoken');

						});

					}

				});
			};

			/* const getMember = function () {

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

			}; */

			scope.selectMaster = function (master) {

				// var checkLayoutForChanges = middlewareService.getWarningOfLayoutChangesLossFn();
				const changeMasterUser = function () {

					middlewareService.masterUserChanged();

					globalDataService.setMasterUser(master);

					authorizerService.setCurrentMasterUser(master.id).then(function (data) {

						if (data.base_api_url) {
							baseUrlService.setMasterUserPrefix(data.base_api_url)
						}

						// $state.go('app.portal.home', null, {reload: 'app'});

						// window.location.reload();
						if (broadcastChannelService.isAvailable) {
							broadcastChannelService.postMessage('finmars_broadcast', {event: crossTabEvents.MASTER_USER_CHANGED});
						}

						getMasterUsersList();

						if ($state.current.name.startsWith('app.portal')) {
							$state.reload('app.portal')

						} else {
							$state.go('app.portal.home')
						}

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

					$state.go('app.portal.home');

				}

			};

			if (scope.openedInside === 'portal') {

				deregisterOnSuccessTransitionHook = $transitions.onSuccess({}, function (transition) {
					scope.currentLocation = metaService.getHeaderTitleForCurrentLocation($state);
				});

			}

			const init = async function () {

				const user = globalDataService.getUser();
				scope.userName = user.username;

				if (scope.openedInside === 'portal') scope.currentLocation = metaService.getHeaderTitleForCurrentLocation($state);

				// Promise.all([usersService.getUser(), getMasterUsersList()]).then(resData => {
				getMasterUsersList().then(resData => {
					scope.$apply();
				});

				websocketService.addEventListener('master_user_change', function (data) {

					scope.currentMasterUser = globalDataService.getMasterUser();
					console.log("Header master user change")
				})

			};

			init();

			if (scope.openedInside === 'portal') {

				scope.$on("$destroy", function () {
					deregisterOnSuccessTransitionHook();
				});

			}

		}
	}

};