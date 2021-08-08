/**
 * Created by sergey on 30.07.16.
 */
// (function(){

'use strict';

// import cookieService from '../../../../core/services/cookieService';

// module.exports = function($scope) {
// import websocketService from "../../../../shell/scripts/app/services/websocketService";

export default function ($scope, authorizerService, globalDataService) {

	let vm = this;

	vm.readyStatus = false;

	vm.hasCurrentMasterUser = globalDataService.doUserHasCurrentMasterUser();


	const init = function () {

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