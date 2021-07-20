/**
 * Created by mevstratov on 18.05.2021
 */

// (function () {

'use strict';
// import * as authorizerService from '../services/authorizerService';
// const cookieService = require('../../../../core/services/cookieService');
import websocketService from "../../../../shell/scripts/app/services/websocketService.js";
import baseUrlService from "../services/baseUrlService.js";
import crossTabEvents from "../services/events/crossTabEvents";

export default function ($scope, $state, $transitions, $urlService, $mdDialog, cookieService, broadcastChannelService, middlewareService, authorizerService, globalDataService) {

	let vm = this;

	// vm.isAuthenticated = false; // check if logged in or not
	let isAuthenticated = false;
	vm.isAuthenticated = isAuthenticated;
	vm.isAuthenticationPage = $state.current.name === 'app.authentication';

	// let finmarsBroadcastChannel = new BroadcastChannel('finmars_broadcast');
	// vm.isIdentified = false; // check if has proper settings (e.g. has master users to work with)
	const PROJECT_ENV = '__PROJECT_ENV__'; // changed when building project by minAllScripts()

	let readyStatus = false;

	let transitionFromState = '';

	vm.showPageContent = function () {

		if (vm.isAuthenticationPage) return !isAuthenticated;

		// return vm.readyStatus.masterUsers && vm.isAuthenticated;
		return isAuthenticated && readyStatus;

	}

	const onLogInSuccess = function (authorizationToken) {

		vm.username = '';

		if (authorizationToken) cookieService.setCookie('authtoken', authorizationToken);

		authorizerService.getMe().then(activeUser => {

			globalDataService.setUser(activeUser);

			isAuthenticated = true;
			vm.isAuthenticated = isAuthenticated;

			readyStatus = true;

			$state.go('app.profile', {}, {});

		});

	}
	/** Used inside shell/.../login-view.html */
	vm.logIn = function ($event) {
		// vm.username, vm.password set inside login-view.html
		authorizerService.tokenLogin(vm.username, vm.password).then(function (data) {

			console.log('authorizerService.login.data', data);

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
					if (res.status === 'agree') onLogInSuccess(data.token);
				});

			} else {
				onLogInSuccess(data.token);
			}

		}).catch(error => {
			console.error(error);
		});

		vm.password = '';

	};

	const getUser = function () {

		return new Promise(function (resolve, reject) {

			authorizerService.getMe().then(function (userData) {

				vm.user = userData;
				resolve();

			}).catch(error => {
				reject(error);
			});

		});
		// return authorizerService.getMe();

	};

	const initTransitionListener = function () {

		$transitions.onBefore({}, function (transition) {

			const resetUrlAfterAbortion = function () {

				let fromUrl = $state.href($state.current.name, {}, {relative: true});
				fromUrl = fromUrl.slice(2); // remove #! part
				$urlService.url(fromUrl, true);

			};

			if (isAuthenticated) {

				if (transition.to().name === 'app.authentication') {

					resetUrlAfterAbortion();
					return false;

				}

			} else if (transition.to().name !== 'app.authentication') {

				resetUrlAfterAbortion();
				return false;
				// transition.abort();
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

			if (transitionFromState === 'app.authentication') {
				vm.username = '';
				vm.password = '';
			}

			// middlewareService.clearEvents();
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

				$state.go('app.portal.home');
				// vm.getMasterUsersList();
			}

			if (ev.data.event === crossTabEvents.LOGOUT) {

				middlewareService.initLogOut();

				authorizerService.logout().then(function (data) {

					sessionStorage.removeItem('afterLoginEvents');

					/* if (window.location.pathname !== '/') {
						window.location.pathname = '/';
					} else {
						window.location.reload()
					} */
					$state.go('app.authentication');

					cookieService.deleteCookie('authtoken');

				});

			}


		};

		broadcastChannelService.setOnmessage('finmars_broadcast', onmessageCallback);

	}

	const init = function () {

		if (PROJECT_ENV !== 'local') {

			websocketService.addEventListener('master_user_change', function (data){

				console.log('master_user_change data', data);

				/* if (window.location.pathname !== '/') {
					window.location.href = '/portal/#!/';
				} else {
					window.location.reload()
				} */
				if ($state.current.name === 'app.portal.home') {
					$state.reload('app');

				} else {
					$state.go('app.portal.home');
				}

			})

		}

		middlewareService.addListenerOnLogOut(function () {
			isAuthenticated = false;
			vm.isAuthenticated = isAuthenticated;
		});

		initTransitionListener();

		if (broadcastChannelService.isAvailable) {
			initCrossTabBroadcast();
		}

		authorizerService.ping().then(function (data) {

			// console.log('ping data', data);

			if (!data.is_authenticated) {

				// vm.initLoginDialog();
				isAuthenticated = false;
				vm.isAuthenticated = isAuthenticated;

				$state.go('app.authentication');

			} else {

				if (data.base_api_url) {
					baseUrlService.setMasterUserPrefix(data.base_api_url);
				}

				isAuthenticated = true;
				vm.isAuthenticated = isAuthenticated;

				if (data.current_master_user_id) {

					globalDataService.setCurrentMasterUserStatus(true);

					if (vm.isAuthenticationPage) {
						$state.go('app.portal.home');
					}

				} else {

					globalDataService.setCurrentMasterUserStatus(false);

					if ($state.current.name !== 'app.profile') $state.go('app.profile', {}, {});

				}

				/* if (!data.current_master_user_id && $state.current.name !== 'app.profile') {

					$state.go('app.profile', {}, {});

				} else if (vm.isAuthenticationPage) {
					$state.go('app.portal.home');
				} */
				console.log("User status: Authenticated");

				getUser().then(() => {

					readyStatus = true;
					$scope.$apply();

				});

			}

		}).catch(error => {
			if (!error.is_authenticated) $state.go('app.authentication');
		})

	};

	init();
	// vm.currentGlobalState = 'portal';

};

// })();