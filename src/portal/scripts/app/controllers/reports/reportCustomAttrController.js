/**
 * Created by szhitenev on 14.06.2016.
 */
(function () {

	'use strict';
	var logService = require('../../../../../core/services/logService');

	var balanceReportCustomAttrService = require('../../services/reports/balanceReportCustomAttrService');

	module.exports = function ($scope, $stateParams, $mdDialog) {

		logService.controller('BalanceReportCustomAttributesController', 'initialized');

		var vm = this;

		vm.showHidden = false;

		vm.attrs = [];

		//vm.entityType = '';

		vm.entityType = $stateParams.entityType;

		var getList = function () {
			balanceReportCustomAttrService.getList(vm.entityType).then(function (data) {
				vm.attrs = data.results;
				$scope.$apply();
				console.log('balance custom attr', vm.attrs);
			});
		};

		getList();

		vm.addAttribute = function (ev) {
			$mdDialog.show({
				controller: 'BalanceReportDialogCustomAttrController as vm',
				templateUrl: 'views/dialogs/balance-report-custom-attr-dialog-view.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				locals: {
					data: {
						editRestriction: false
					}
				}
			}).then(function (res) {
				if (res.status === 'agree') {
					console.log(res.data.attribute);
					console.log("res", res.data);
					balanceReportCustomAttrService.create(res.data.attribute).then(getList);
				}
			});
		};

		// function setName(item) {
		//     item.name = item.text;
		//     if (item.id.indexOf('j') !== -1) {
		//         delete item['li_attr'];
		//         delete item['state'];
		//         delete item['icon'];
		//         delete item['a_attr'];
		//         delete item['data'];
		//         delete item['text'];
		//         delete item['type'];
		//         delete item.id;
		//     }
		//     item.children = item.children.map(setName);
		//     return item
		// }

		vm.editAttr = function (item, ev) {
			$mdDialog.show({
				controller: 'BalanceReportDialogCustomAttrController as vm',
				templateUrl: 'views/dialogs/balance-report-custom-attr-dialog-view.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				locals: {
					data: {
						attributeId: item.id,
						editRestriction: true
					}
				}
			}).then(function (res) {
				if (res.status === 'agree') {
					console.log("res", res.data);
					balanceReportCustomAttrService.update(res.data.attribute.id, res.data.attribute).then(getList);
				}
			});
		};

		// vm.toggleHidden = function () {
		//     vm.showHidden = !vm.showHidden;
		// };

		vm.checkIsHidden = function(attribute){
			// if(vm.showHidden == false && attribute.is_hidden == true) {
			//     return false;
			// }
			return true;
		};

		vm.deleteAttr = function (item, ev) {

			var description = 'Are you sure to delete attribute ' + item.name + ' ?';

			$mdDialog.show({
				controller: 'WarningDialogController as vm',
				templateUrl: 'views/warning-dialog-view.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose: true,
				locals: {
					warning: {
						title: 'Warning',
						description: description
					}
				}
			}).then(function (res) {
				console.log('res', res);
				if (res.status === 'agree') {
					balanceReportCustomAttrService.deleteByKey(item.id).then(function (data) {
						if (data.status === 'conflict') {
							$mdDialog.show({
								controller: 'InfoDialogController as vm',
								templateUrl: 'views/info-dialog-view.html',
								parent: angular.element(document.body),
								targetEvent: ev,
								clickOutsideToClose: true,
								locals: {
									info: {
										title: 'Notification',
										description: "You can not delete attributed that already in use"
									}
								}
							})
						} else {
							getList();
						}
					});

				}

			});
		};

	}

}());