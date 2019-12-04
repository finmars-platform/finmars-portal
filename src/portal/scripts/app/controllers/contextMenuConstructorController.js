/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    var uiService = require('../services/uiService');

    var transactionTypeService = require('../services/transactionTypeService');

    module.exports = function ($scope, $stateParams, $state, $mdDialog) {

        var vm = this;

        vm.readyStatus = {
            transactionTypes: false,
            data: false
        };

        vm.layout = {
            name: '',
            type: 'report_context_menu',
            data: {
                menu: {
                    root: {
                        items: []
                    }
                }
            }
        };

        vm.defaultMenu = {
            root: {
                items: [
                    {
                        name: 'Edit Instrument',
                        action: 'edit_instrument'
                    },
                    {
                        name: 'Edit Account',
                        action: 'edit_account'
                    },
                    {
                        name: 'Edit Portfolio',
                        action: 'edit_portfolio'
                    },
                    {
                        name: 'Edit Price',
                        action: 'edit_price'
                    },
                    {
                        name: 'Edit FX Rate',
                        action: 'edit_fx_rate'
                    },
                    {
                        name: 'Edit Pricing FX Rate',
                        action: 'edit_pricing_currency_price'
                    },
                    {
                        name: 'Edit Accrued FX Rate',
                        action: 'edit_accrued_currency_fx_rate'
                    },
                    {
                        name: 'Edit Currency',
                        action: 'edit_currency'
                    },
                    {
                        name: 'Edit Transaction',
                        action: 'rebook_transaction'
                    },
                    {
                        name: 'Open Book Manager',
                        action: 'book_transaction'
                    }
                ]
            }
        };

        vm.editOption = function ($event, item) {

            console.log("Controller edit option", $event);
            console.log("Controller edit item", item);


            $mdDialog.show({
                controller: 'ContextMenuOptionSettingsDialogController as vm',
                templateUrl: 'views/dialogs/context-menu-option-settings-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                locals: {
                    data: {
                        transactionTypes: vm.transactionTypes,
                        item: Object.assign({}, item)
                    }
                }
            }).then(function (res) {

                if (res && res.status === 'agree') {

                    Object.keys(res.data.item).forEach(function (key) {

                        item[key] = res.data.item[key]

                    });

                }

            })


        };

        vm.addOption = function ($event, parentOption) {

            console.log("Controller add option", parentOption)

            $mdDialog.show({
                controller: 'ContextMenuOptionSettingsDialogController as vm',
                templateUrl: 'views/dialogs/context-menu-option-settings-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                locals: {
                    data: {
                        transactionTypes: vm.transactionTypes,
                        item: {}
                    }
                }
            }).then(function (res) {

                if (res && res.status === 'agree') {

                    if (!parentOption.hasOwnProperty('items')) {
                        parentOption.items = [];
                    }

                    parentOption.items.push(res.data.item)

                }

            })

        };

        vm.deleteOption = function ($event, parentOption, $index) {

            console.log("Controller delete option", parentOption)

            $mdDialog.show({
                controller: 'WarningDialogController as vm',
                templateUrl: 'views/warning-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                clickOutsideToClose: false,
                locals: {
                    warning: {
                        title: 'Warning',
                        description: "Are you sure you want to delete this option?"
                    }
                },
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                multiple: true
            }).then(function (res) {

                if (res && res.status === 'agree') {

                    parentOption.items.splice($index, 1);

                }

            })

        };

        vm.getTransactionTypes = function () {

            transactionTypeService.getListLight({
                pageSize: 1000
            }).then(function (data) {

                vm.transactionTypes = data.results;

                vm.readyStatus.transactionTypes = true;

                $scope.$apply();

            })

        };

        vm.getLayout = function () {

            vm.readyStatus.data = false;

            uiService.getContextMenuLayoutByKey(vm.layout.id).then(function (data) {

                vm.layout = data;

                vm.readyStatus.data = true;

                $scope.$apply();

            })

        };

        vm.saveLayout = function ($event) {

            if (vm.layout.id) {

                uiService.updateContextMenuLayout(vm.layout.id, vm.layout).then(function (data) {

                    vm.layout = data;

                    $mdDialog.show({
                        controller: 'InfoDialogController as vm',
                        templateUrl: 'views/info-dialog-view.html',
                        parent: angular.element(document.body),
                        targetEvent: $event,
                        clickOutsideToClose: false,
                        locals: {
                            info: {
                                title: 'Success',
                                description: "Context Menu Layout is Saved"
                            }
                        }
                    });

                    $scope.$apply();

                })

            } else {

                uiService.createContextMenuLayout(vm.layout).then(function (data) {

                    vm.layout = data;

                    $mdDialog.show({
                        controller: 'InfoDialogController as vm',
                        templateUrl: 'views/info-dialog-view.html',
                        parent: angular.element(document.body),
                        targetEvent: $event,
                        clickOutsideToClose: false,
                        locals: {
                            info: {
                                title: 'Success',
                                description: "Context Menu Layout is Saved"
                            }
                        }
                    });

                    $scope.$apply();

                })

            }

        };

        vm.init = function () {

            vm.getTransactionTypes();

            if ($stateParams.id && $stateParams.id !== 'new') {

                vm.layout.id = $stateParams.id;

                vm.getLayout();

            } else {

                vm.layout.data.menu = vm.defaultMenu;

                vm.readyStatus.data = true;

            }

        };

        vm.init();

    }

}());