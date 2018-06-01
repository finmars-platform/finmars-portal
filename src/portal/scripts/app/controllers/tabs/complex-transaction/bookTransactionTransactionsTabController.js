/**
 * Created by szhitenev on 29.11.2016.
 */
(function () {

	'use strict';

	module.exports = function ($scope, $mdDialog) {

		var vm = this;

		vm.transactions = $scope.$parent.vm.entity.transactions_object;

		console.log('complex transactions scope', $scope, vm.transactions);

		vm.editBaseTransaction = function (ev, entityId) {
			$mdDialog.show({
				controller: 'EntityViewerEditDialogController as vm',
				templateUrl: 'views/entity-viewer/entity-viewer-dialog-view.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				locals: {
                    entityType: 'transaction',
					entityId: entityId
				}
			}).then(function (res) {
				if (res && res.res === 'agree') {
					scope.externalCallback();
				}
			});
		}
		// scope.editEntity = function (ev, entity) {
		// 	$mdDialog.show({
		// 		controller: 'EntityViewerEditDialogController as vm',
		// 		templateUrl: 'views/entity-viewer/entity-viewer-dialog-view.html',
		// 		parent: angular.element(document.body),
		// 		targetEvent: ev,
		// 		//clickOutsideToClose: true,
		// 		locals: {
		// 			parentScope: scope,
		// 			entityId: entity.id
		// 		}
		// 	}).then(function (res) {
		// 		if (res && res.res === 'agree') {
		// 			scope.externalCallback();
		// 		}
		// 	});
		// };

	}

}());