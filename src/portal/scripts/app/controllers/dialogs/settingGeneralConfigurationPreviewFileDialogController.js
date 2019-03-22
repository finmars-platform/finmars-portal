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

        vm.settings = {};

        vm.processing = false;

        vm.selectAllState = false;

        vm.toggleMode = function (mode) {

            if (vm.settings.mode === mode) {
                vm.settings.mode = null
            } else {
                vm.settings.mode = mode
            }

        };

        vm.items = file.body;

        vm.items.forEach(function (item) {

            item.active = false;

            item.content.forEach(function (child) {
                child.active = false;
            });

        });

        var sortItems = function () {

            var firstWorkingInterfaceItem = false;
            var firstTransactionTypesItem = false;
            var firstBaseElementsItem = false;
            var firstConfigurationsItem = false;
            var firstUserAttributesItem = false;
            var firstImportFromFileItem = false;
            var firstSchemesDownloads = false;

            vm.items.forEach(function (parent) {

                switch (parent.entity) {

                    case 'ui.editlayout':
                    case 'ui.listlayout':
                    case 'ui.reportlayout':
                    case 'ui.bookmark':
                        parent.order = 1;
                        if (!firstWorkingInterfaceItem) {
                            firstWorkingInterfaceItem = true;
                            parent.first = 'Working Interface'
                        }
                        break;

                    case 'transactions.transactiontype':
                    case 'transactions.transactiontypegroup':
                        parent.order = 2;
                        if (!firstTransactionTypesItem) {
                            firstTransactionTypesItem = true;
                            parent.first = 'Transaction Types'
                        }
                        break;

                    case 'instruments.instrumenttype':
                    case 'accounts.accounttype':
                    case 'currencies.currency':
                    case 'instruments.pricingpolicy':
                        parent.order = 3;
                        if (!firstBaseElementsItem) {
                            firstBaseElementsItem = true;
                            parent.first = 'Base Elements'
                        }
                        break;;

                    case 'import.pricingautomatedschedule':
                        parent.order = 4;
                        if (!firstConfigurationsItem) {
                            firstConfigurationsItem = true;
                            parent.first = 'Configurations'
                        }
                        break;

                    case 'obj_attrs.portfolioattributetype':
                    case 'obj_attrs.accountattributetype':
                    case 'obj_attrs.accounttypeattributetype':
                    case 'obj_attrs.responsibleattributetype':
                    case 'obj_attrs.counterpartyattributetype':
                    case 'obj_attrs.instrumentattributetype':
                    case 'obj_attrs.instrumenttypeattributetype':
                        parent.order = 5;
                        if (!firstUserAttributesItem) {
                            firstUserAttributesItem = true;
                            parent.first = 'User Attributes'
                        }
                        break;

                    case 'csv_import.scheme':
                    case 'integrations.complextransactionimportscheme':
                        parent.order = 6;
                        if (!firstImportFromFileItem) {
                            firstImportFromFileItem = true;
                            parent.first = 'Schemes: Import from File'
                        }
                        break;

                    case 'integrations.instrumentdownloadscheme':
                    case 'integrations.pricedownloadscheme':
                        parent.order = 7;
                        if (!firstSchemesDownloads) {
                            firstSchemesDownloads = true;
                            parent.first = 'Schemes: Downloads'
                        }
                        break;
                }

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

                    if (item.hasOwnProperty('___content_type')) {
                        return item.name + ' (' + metaContentTypesService.getEntityNameByContentType(item.___content_type) + ')'
                    }

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

                configurationImportHelper.importConfiguration(vm.items, vm.settings).then(function (data) {

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