/**
 * Created by szhitenev on 14.06.2016.
 */
(function () {

    'use strict';

    var evEvents = require('../../services/entityViewerEvents');

    var customFieldService = require('../../services/reports/customFieldService');

    //var AttributeDataService = require('../../services/attributeDataService');

    module.exports = function ($scope, $mdDialog, attributeDataService, entityViewerEventService, data) {

        var vm = this;

        vm.attributeDataService = attributeDataService;
        vm.entityViewerEventService = entityViewerEventService;
        vm.customFields = [];
        vm.entityType = data.entityType;

        vm.readyStatus = {customFields: false, attributes: false};

        vm.getList = function () {

            customFieldService.getList(vm.entityType).then(function (data) {

                vm.customFields = data.results;

                console.log('vm.customFields', vm.customFields);

                vm.readyStatus.customFields = true;

                $scope.$apply();

            });

        };

        vm.addCustomField = function (ev) {

            $mdDialog.show({
                controller: 'CustomFieldAddDialogController as vm',
                templateUrl: 'views/dialogs/custom-field-add-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                locals: {
                    data: {
                        entityType: vm.entityType
                    },
                    attributeDataService: vm.attributeDataService
                },
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                multiple: true
            }).then(function (res) {
                if (res && res.status === 'agree') {

                    vm.attributeDataService.downloadCustomFieldsByEntityType(vm.entityType);
                    vm.entityViewerEventService.dispatchEvent(evEvents.DYNAMIC_ATTRIBUTES_CHANGE);
                    vm.getList();

                }
            });

        };

        vm.editCustomField = function (item, ev) {

            $mdDialog.show({
                controller: 'CustomFieldEditDialogController as vm',
                templateUrl: 'views/dialogs/custom-field-edit-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                locals: {
                    data: {
                        entityType: vm.entityType,
                        customField: Object.assign({}, item)
                    },
                    attributeDataService: vm.attributeDataService
                },
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                multiple: true
            }).then(function (res) {
                if (res && res.status === 'agree') {

                    vm.attributeDataService.downloadCustomFieldsByEntityType(vm.entityType);
                    vm.entityViewerEventService.dispatchEvent(evEvents.DYNAMIC_ATTRIBUTES_CHANGE);
                    vm.getList();

                }
            });

        };


        vm.deleteCustomField = function (item, ev) {

            var description = 'Are you sure to delete Custom Column ' + item.name + ' ?';

            $mdDialog.show({
                controller: 'WarningDialogController as vm',
                templateUrl: 'views/warning-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: false,
                locals: {
                    warning: {
                        title: 'Warning',
                        description: description
                    }
                },
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                multiple: true
            }).then(function (res) {
                console.log('res', res);
                if (res.status === 'agree') {
                    customFieldService.deleteByKey(vm.entityType, item.id).then(function (data) {
                        if (data.status === 'conflict') {
                            $mdDialog.show({
                                controller: 'InfoDialogController as vm',
                                templateUrl: 'views/info-dialog-view.html',
                                parent: angular.element(document.body),
                                targetEvent: ev,
                                clickOutsideToClose: false,
                                locals: {
                                    info: {
                                        title: 'Notification',
                                        description: "You can not delete attributed that already in use"
                                    }
                                }
                            })
                        } else {

                            vm.attributeDataService.downloadCustomFieldsByEntityType(vm.entityType);
                            vm.entityViewerEventService.dispatchEvent(evEvents.DYNAMIC_ATTRIBUTES_CHANGE);
                            vm.getList();

                        }
                    });

                }

            });
        };


        // This controller could be also opened as a dialog
        vm.cancel = function () {
            $mdDialog.hide();
        };

        vm.downloadAttributes = function(){

            var promises = [];

            promises.push(vm.attributeDataService.downloadCustomFieldsByEntityType('balance-report'));
            promises.push(vm.attributeDataService.downloadCustomFieldsByEntityType('pl-report'));
            promises.push(vm.attributeDataService.downloadCustomFieldsByEntityType('transaction-report'));

            promises.push(vm.attributeDataService.downloadDynamicAttributesByEntityType('portfolio'));
            promises.push(vm.attributeDataService.downloadDynamicAttributesByEntityType('account'));
            promises.push(vm.attributeDataService.downloadDynamicAttributesByEntityType('instrument'));
            promises.push(vm.attributeDataService.downloadDynamicAttributesByEntityType('responsible'));
            promises.push(vm.attributeDataService.downloadDynamicAttributesByEntityType('counterparty'));
            promises.push(vm.attributeDataService.downloadDynamicAttributesByEntityType('transaction-type'));
            promises.push(vm.attributeDataService.downloadDynamicAttributesByEntityType('complex-transaction'));

            if (vm.entityType === 'balance-report') {
                promises.push(vm.attributeDataService.downloadInstrumentUserFields());
            }

            if (vm.entityType === 'pl-report') {
                promises.push(vm.attributeDataService.downloadInstrumentUserFields());
            }

            if (vm.entityType === 'transaction-report') {
                promises.push(vm.attributeDataService.downloadInstrumentUserFields());
                promises.push(vm.attributeDataService.downloadTransactionUserFields());
            }

            Promise.all(promises).then(function (data) {

                vm.readyStatus.attributes = true;
                $scope.$apply();

            })

        };

        vm.init = function () {

            //vm.attributeDataService = new AttributeDataService();

            vm.downloadAttributes();

            vm.getList();

        };

        vm.init();
    }

}());