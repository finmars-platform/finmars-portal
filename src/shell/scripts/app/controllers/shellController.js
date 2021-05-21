/**
 * Created by mevstratov on 18.05.2021
 */

// (function () {

	'use strict';
	// import * as authorizerService from '../services/authorizerService';

export default function shellController ($scope, $state, $transitions, $mdDialog, middlewareService, authorizerService) {

		let vm = this;
		console.log("testing shellController init");
		// vm.isAuthenticated = false; // check if logged in or not
		let isAuthenticated = false;
		vm.isAuthenticated = isAuthenticated;

		vm.isAuthenticationPage = $state.current.name === 'app.authentication';
		// vm.isIdentified = false; // check if has proper settings (e.g. has master users to work with)
		console.log("testing shellController vm.isAuthenticationPage", vm.isAuthenticationPage);
		vm.readyStatus = {masters: false};

		vm.showPageContent = function () {

			if (vm.isAuthenticationPage) return !isAuthenticated;

			return vm.readyStatus.masters && vm.isAuthenticated;

		}

		vm.logIn = function () {

		};

		vm.test = function () {
			console.log("testing shellController working from here");
		};

		vm.initTransitionListener = function () {

			$transitions.onSuccess({}, function (trans) {

				var count_cached_requests = 0;

				if (window.cached_requests) {
					count_cached_requests = Object.keys(window.cached_requests).length;
				}

				window.cached_requests = {};
				console.log('Clear Cached Requests. Total: ', count_cached_requests);

				var location = metaService.getCurrentLocation($state);

				var title = 'Finmars';

				if (location !== '') {
					title = title + ' - ' + location;
				}

				document.title = title;

				// setTimeout(function () {
				//     window.dispatchEvent(new Event('resize'));
				// }, 1000);

			});

			$transitions.onStart({}, function (transition) {
				console.log("testing transition onStart");
				$mdDialog.hide();

				if (!isAuthenticated && transition.to().name !== 'app.authentication') {
					console.log("testing not authenticated user transition aborted");
					transition.abort();
				}

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

			$transitions.onSuccess({}, function (transition) {

				middlewareService.clearEvents();

				vm.currentGlobalState = vm.getCurrentGlobalState();

				var from = transition.from();

				if (from.name === 'app.profile') {
					vm.getMasterUsersList();
				}

				vm.isAuthenticationPage = transition.to().name === 'app.authentication';

			});

		};

		const init = function () {

			vm.initTransitionListener();

			authorizerService.ping().then(function (data) {

				// console.log('ping data', data);

				if (!data.is_authenticated) {

					// vm.initLoginDialog();
					isAuthenticated = false;
					vm.isAuthenticated = isAuthenticated;

					$state.go('app.authentication');

				} else {

					isAuthenticated = true;
					vm.isAuthenticated = isAuthenticated;

					if (!data.current_master_user_id) {
						$state.go('app.profile', {}, {})
					}

					if (data.base_api_url) {
						baseUrlService.setMasterUserPrefix(data.base_api_url)
					}

					console.log("User status: Authenticated");

					$scope.$apply();

					setTimeout(function () {
						vm.initShell();
					}, 100);
				}

			}).catch(function(data){
				if (!data.is_authenticated) {
					// vm.initLoginDialog();
					$state.go('app.authentication');
				}
			})

		};

		init();

		// vm.currentGlobalState = 'portal';

	};

// })();