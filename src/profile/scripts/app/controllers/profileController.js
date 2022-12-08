/**
 * Created by sergey on 30.07.16.
 */
// (function(){

'use strict';

// import cookieService from '../../../../core/services/cookieService';

// module.exports = function($scope) {
// import websocketService from "../../../../shell/scripts/app/services/websocketService";

export default function ($scope, authorizerService, globalDataService, redirectionService) {

	let vm = this;
	console.log("testing.880 profileController redirection")
	window.open(redirectionService.getUrl('app.profile'), '_self')

	vm.readyStatus = false;

	vm.hasCurrentMasterUser = globalDataService.doUserHasCurrentMasterUser();


	const init = function () {

		vm.resetPasswordLink = 'https://keycloak.finmars.com:8443/realms/finmars/login-actions/reset-credentials';

		vm.readyStatus = false;

		vm.user = globalDataService.getUser();

		if (vm.hasCurrentMasterUser) {

			const currentMasterUser = globalDataService.getMasterUser();

			if (!currentMasterUser) {

				authorizerService.getCurrentMasterUser().then(() => {
					vm.readyStatus = true;
					$scope.$apply();
				});

			} else {
				vm.readyStatus = true;
			}

		} else {
			vm.readyStatus = true;
		}

	};

	init();

};

// })();