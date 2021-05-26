/**
 * Created by mevstratov on 18.05.2021
 */

// (function () {

'use strict';
// import * as authorizerService from '../services/authorizerService';
// const cookieService = require('../../../../core/services/cookieService');

import baseUrlService from "../services/baseUrlService.js";
import crossTabEvents from "../services/events/crossTabEvents";

export default function ($scope, $state, $transitions, $mdDialog, cookieService, broadcastChannelService, middlewareService, authorizerService) {

	let vm = this;
	console.log("testing shellController init");
	// vm.isAuthenticated = false; // check if logged in or not
	let isAuthenticated = false;
	vm.isAuthenticated = isAuthenticated;
	vm.isAuthenticationPage = $state.current.name === 'app.authentication';

	// let finmarsBroadcastChannel = new BroadcastChannel('finmars_broadcast');
	// vm.isIdentified = false; // check if has proper settings (e.g. has master users to work with)
	console.log("testing shellController vm.isAuthenticationPage1", vm.isAuthenticationPage, isAuthenticated);
	let readyStatus = false;

	let transitionFromState = '';

	vm.showPageContent = function () {

		if (vm.isAuthenticationPage) return !isAuthenticated;

		// return vm.readyStatus.masters && vm.isAuthenticated;
		return isAuthenticated && readyStatus;

	}

	/** Used inside shell/.../login-view.html */
	vm.logIn = function ($event) {
		// vm.username, vm.password setted inside login-view.html
		authorizerService.tokenLogin(vm.username, vm.password).then(function (data) {

			console.log('authorizerService.login.data', data);

			if (data.token) cookieService.setCookie('authtoken', data.token);

			if (data.two_factor_check) {

				$mdDialog.show({
					controller: 'TwoFactorLoginDialogController as vm',
					templateUrl: 'views/dialogs/two-factor-login-dialog-view.html',
					parent: angular.element(document.body),
					locals: {
						username: vm.username
					},
					multiple: true,
					targetEvent: $event

				})
				.then(res => {

					if (res.status === 'agree') {

						isAuthenticated = true;
						vm.isAuthenticated = isAuthenticated;

						$state.go('app.profile', {}, {});

					}

				});

			} else {
				console.log("testing transitionFromState", transitionFromState);
				isAuthenticated = true;
				vm.isAuthenticated = isAuthenticated;

				$state.go('app.profile', {}, {});

			}

		}).catch(error => {
			console.log("testing login error", error);
		});

	};

	const getUser = function () {

		/* return new Promise(function (resolve, reject) {

			authorizerService.getUser().then(function (userData) {

				vm.user = userData;
				resolve();

			}).catch(error => {
				reject(error);
			});

		}); */
		return authorizerService.getUser();

	};

	const initTransitionListener = function () {

		$transitions.onBefore({}, function (transition) {
			console.log("testing transition onStart", transition.from().name);
			$mdDialog.hide();

			if (isAuthenticated) {
				console.log("testing not authenticated user transition aborted");
				if (transition.to().name === 'app.authentication') transition.abort();

			} else if (transition.to().name !== 'app.authentication') {
				transition.abort();
			}

		});

		$transitions.onStart({}, function (transition) {

			const openedDialogs = document.querySelectorAll('md-dialog');

			openedDialogs.forEach(() => {
				$mdDialog.hide();
			});

		});

		$transitions.onSuccess({}, function (transition) {

			var count_cached_requests = 0;

			if (window.cached_requests) {
				count_cached_requests = Object.keys(window.cached_requests).length;
			}

			window.cached_requests = {};
			console.log('Clear Cached Requests. Total: ', count_cached_requests);

			/* var location = metaService.getCurrentLocation($state);

			var title = 'Finmars';

			if (location !== '') {
				title = title + ' - ' + location;
			}

			document.title = title;

			setTimeout(function () {
				window.dispatchEvent(new Event('resize'));
			}, 1000); */
			transitionFromState = transition.from().name;

			middlewareService.clearEvents();
			vm.isAuthenticationPage = transition.to().name === 'app.authentication';

		});

		/* $transitions.onFinish({}, function (transition) {

			pageStateName = transition.to().name;
			pageStateParams.strategyNumber = transition.params().strategyNumber;
			pageStateParams.layoutUserCode = transition.params().layoutUserCode;

			if (pageStateName.indexOf('app.data.') !== -1 || vm.isReport(pageStateName)) {

				showLayoutName = true;
				vm.activeLayoutName = null;
				vm.activeSPLayoutName = false;

				vm.getActiveLayoutName();

			} else {
				showLayoutName = false;
			}

		}); */

	};

	const initCrossTabBroadcast = function () {

		broadcastChannelService.openChannel('finmars_broadcast');

		const onmessageCallback = function (ev) {

			if (ev.data.event === crossTabEvents.MASTER_USER_CHANGED) {
				middlewareService.masterUserChanged();

				$state.go('app.home');
				vm.getMasterUsersList();
			}

			if (ev.data.event === crossTabEvents.LOGOUT) {

				middlewareService.initLogOut();

				usersService.logout().then(function (data) {

					sessionStorage.removeItem('afterLoginEvents');

					if (window.location.pathname !== '/') {
						window.location.pathname = '/';
					} else {
						window.location.reload()
					}

					cookieService.deleteCookie();

				});

			}


		};

		broadcastChannelService.setOnmessage('finmars_broadcast', onmessageCallback);

	}

	const init = function () {

		initTransitionListener();
		console.log("testing broadcast", broadcastChannelService.isAvailable);
		if (broadcastChannelService.isAvailable) {
			initCrossTabBroadcast();
		}

		authorizerService.ping().then(function (data) {

			// console.log('ping data', data);
			console.log("testing shellController ping ", data);
			if (!data.is_authenticated) {

				// vm.initLoginDialog();
				isAuthenticated = false;
				vm.isAuthenticated = isAuthenticated;
				console.log("testing shellController isAuthenticated 1", isAuthenticated);
				$state.go('app.authentication');

			} else {

				isAuthenticated = true;
				vm.isAuthenticated = isAuthenticated;
				console.log("testing shellController isAuthenticated 2", isAuthenticated);
				if (!data.current_master_user_id) {
					console.log("testing ecosystem not chosen", isAuthenticated);
					$state.go('app.profile', {}, {});

				} else if (vm.isAuthenticationPage) {
					console.log("testing ecosystem chosen1", isAuthenticated);
					$state.go('app.home');
				}

				if (data.base_api_url) {
					baseUrlService.setMasterUserPrefix(data.base_api_url)
				}
				console.log("User status: Authenticated");

				getUser().then(() => {

					readyStatus = true;
					$scope.$apply();

				});

			}
			console.log("testing shellController isAuthenticated 3", isAuthenticated);
		}).catch(error => {
			console.log("testing shellController isAuthenticated 4", error);
			if (!error.is_authenticated) {
				$state.go('app.authentication');
			}
		})

	};

	init();

	// vm.currentGlobalState = 'portal';

};

// })();