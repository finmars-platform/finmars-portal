/**
 * Created by szhitenev on 14.06.2016.
 */
(function () {

    'use strict';

    var customFieldService = require('../../services/reports/customFieldService');

    module.exports = function ($scope, $mdDialog, data) {

        var vm = this;

        vm.customFields = [];
        vm.entityType = data.entityType;

        vm.getList = function () {
            customFieldService.getList(vm.entityType).then(function (data) {

                vm.customFields = data.results;

                console.log('vm.customFields', vm.customFields);

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
                    }
                },
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                multiple: true
            }).then(function (res) {
                if (res.status === 'agree') {
                    vm.getList()
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
                    }
                },
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                multiple: true
            }).then(function (res) {
                if (res.status === 'agree') {
                    vm.getList()
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

        vm.init = function () {

            vm.getList();

        };

        vm.init();
    }

}());