/**
 * Created by szhitenev on 30.05.2016.
 */
(function () {

    'use strict';

    var metaContentTypesService = require('../../services/metaContentTypesService');
    var configurationImportHelper = require('../../helpers/configuration-import.helper');

    module.exports = function ($scope, $mdDialog, file) {

        console.log("file", file);

        var vm = this;

        vm.processing = false;

        vm.selectAllState = false;

        vm.items = file.body;

        vm.items.forEach(function (item) {

            item.active = false;

            item.content.forEach(function (child) {
                child.active = false;
            });

        });

        var sortItems = function () {
            var firstLayoutsItem = false;
            var firstSchemesItem = false;
            var firstEntitiesItem = false;
            var firstAttrsItem = false;

            vm.items.forEach(function (parent) {

                if (parent.entity.toLowerCase().indexOf('layout') !== -1) {
                    parent.order = 1;

                    if (!firstLayoutsItem) {
                        parent.first = 'Layouts';
                        firstLayoutsItem = true;
                    }

                } else if (parent.entity.toLowerCase().indexOf('scheme') !== -1) {
                    parent.order = 2;

                    if (!firstSchemesItem) {
                        parent.first = 'Schemes';
                        firstSchemesItem = true;
                    }

                } else if (parent.entity.toLowerCase().indexOf('obj_attrs') !== -1) {
                    parent.order = 4;

                    if (!firstAttrsItem) {
                        parent.first = 'Attributes';
                        firstAttrsItem = true;
                    }

                } else {
                    parent.order = 3;

                    if (!firstEntitiesItem) {
                        parent.first = 'Entities';
                        firstEntitiesItem = true;
                    }

                };

            });

        };

        sortItems();

        vm.getEntityName = function (item) {

            switch (item.entity) {
                case 'transactions.transactiontype':
                    return "Transaction Types";
                case 'transactions.transactiontypegroup':
                    return "Transaction Type Groups";
                case 'accounts.accounttype':
                    return "Account Types";
                case 'instruments.pricingpolicy':
                    return "Pricing Policy";
                case 'currencies.currency':
                    return 'Currencies';
                case 'instruments.instrumenttype':
                    return "Instrument Types";
                case 'import.pricingautomatedschedule':
                    return 'Automated uploads schedule ';
                case 'ui.editlayout':
                    return "Input Form";
                case 'ui.listlayout':
                    return "Entity viewer layouts";
                case 'ui.reportlayout':
                    return "Report builder layouts";
                case 'ui.bookmark':
                    return "Bookmarks";
                case 'csv_import.scheme':
                    return "Simple Entity Import Schemes";
                case 'integrations.instrumentdownloadscheme':
                    return "Instrument Download Schemes";
                case 'integrations.pricedownloadscheme':
                    return "Price Download Schemes";
                case 'integrations.complextransactionimportscheme':
                    return "Complex Transaction Import Scheme";
                case 'obj_attrs.portfolioattributetype':
                    return "Portfolio Dynamic Attributes";
                case 'obj_attrs.accountattributetype':
                    return "Account Dynamic Attributes";
                case 'obj_attrs.accounttypeattributetype':
                    return "Account Type Dynamic Attributes";
                case 'obj_attrs.responsibleattributetype':
                    return "Responsible Dynamic Attributes";
                case 'obj_attrs.counterpartyattributetype':
                    return "Counterparty Dynamic Attributes";
                case 'obj_attrs.instrumentattributetype':
                    return "Instrument Dynamic Attributes";
                case 'obj_attrs.instrumenttypeattributetype':
                    return "Instrument Type Dynamic Attributes";
                default:
                    return "Unknown"
            }

        };

        vm.getItemName = function (item) {

            if (item.hasOwnProperty('user_code')) {
                var result = item.user_code;

                if (item.hasOwnProperty('scheme_name')) {
                    result = item.scheme_name;
                }

                return result;
            }

            if (item.hasOwnProperty('scheme_name')) {
                return item.scheme_name;
            }

            if (item.hasOwnProperty('name')) {

                if (item.hasOwnProperty('csv_fields')) {
                    return item.name + ' (' + metaContentTypesService.getEntityNameByContentType(item.content_type) + ')'
                }

                if (item.hasOwnProperty('data')) {
                    return item.name + ' (' + metaContentTypesService.getEntityNameByContentType(item.content_type) + ')'
                }

                return item.name
            }

            if (item.hasOwnProperty('content_type')) {
                return metaContentTypesService.getEntityNameByContentType(item.content_type)
            }

            if (item.hasOwnProperty('last_run_at')) { // import.pricingautomatedschedule
                return "Schedule"
            }

        };

        vm.toggleSelectAll = function () {

            vm.selectAllState = !vm.selectAllState;

            vm.items.forEach(function (item) {
                item.someChildsActive = false;
                item.active = vm.selectAllState;
                item.content.forEach(function (child) {
                    child.active = vm.selectAllState;
                })

            })

        };

        vm.checkSelectAll = function () {

            var active = true;

            vm.items.forEach(function (item) {

                if (!item.active) {
                    active = false;
                }

                item.content.forEach(function (child) {

                    if (!child.active) {
                        active = false;
                    }

                })

            });

            vm.selectAllState = active;

        };

        vm.toggleActiveForChilds = function (item) {

            item.active = !item.active;
            item.someChildsActive = false;
            item.content.forEach(function (child) {
                child.active = item.active;
            });

            vm.checkSelectAll();

        };

        vm.updateActiveForParent = function (child, parent) {

            child.active = !child.active;

            var ChildIsActive = false;
            var ChildIsNotActive = false;
            var parentIsActive = false;

            parent.content.forEach(function (item) {
                if (item.active) {
                    ChildIsActive = true;
                }
                else {
                    ChildIsNotActive = true;
                }

                if (ChildIsActive && !ChildIsNotActive) {
                    parentIsActive = true;
                }
                else if (!ChildIsActive && ChildIsNotActive) {
                    parent.someChildsActive = false;
                }
                else {
                    parentIsActive = false;
                    parent.someChildsActive = true;
                }

            });

            parent.active = parentIsActive;

            vm.checkSelectAll();

        };

        vm.getEntityDependenciesCaptions = function (entity) {

            var result = '';

            if (entity.dependencies && entity.dependencies.length) {

                result = result + '(Depends on: ';

                var dependenciesList = [];

                entity.dependencies.forEach(function (dependency) {

                    dependenciesList.push(metaContentTypesService.getEntityNameByContentType(dependency.entity))

                });

                result = result + dependenciesList.join(', ');

                result = result + ')';

            }


            return result;

        };

        vm.getCounter = function () {
            return window.importConfigurationCounter;
        };

        vm.agree = function ($event) {

            vm.processing = true;

            vm.activeItemTotal = 0;
            window.importConfigurationCounter = 0;

            vm.items.forEach(function (entity) {

                delete entity.order;
                delete entity.first;

                entity.content.forEach(function (item) {

                    if (item.active) {
                        vm.activeItemTotal = vm.activeItemTotal + 1;
                    }

                })

            });

            try {

                configurationImportHelper.importConfiguration(vm.items).then(function (data) {

                    $mdDialog.hide({status: 'agree', data: {}});

                    $mdDialog.show({
                        controller: 'SuccessDialogController as vm',
                        templateUrl: 'views/dialogs/success-dialog-view.html',
                        targetEvent: $event,
                        preserveScope: true,
                        multiple: true,
                        autoWrap: true,
                        skipHide: true,
                        locals: {
                            success: {
                                title: "",
                                description: "You have successfully imported configuration file"
                            }
                        }

                    });


                }).catch(function (reason) {

                    vm.processing = false;

                    $scope.$apply();

                })


            } catch (error) {
                vm.processing = false;

                console.error(error);
            }

        };

        vm.cancel = function () {
            $mdDialog.cancel();
        };

    }

}());