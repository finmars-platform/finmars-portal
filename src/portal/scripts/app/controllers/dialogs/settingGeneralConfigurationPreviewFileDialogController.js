/**
 * Created by szhitenev on 30.05.2016.
 */
(function () {

    'use strict';

    var metaContentTypesService = require('../../services/metaContentTypesService');
    var metaService = require('../../services/metaService');
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

            var groups = [];
            metaService.getContentGroups("exportImportConfigGroups").then(function (data) {
                groups = data;

                vm.items.forEach(function (parent) {

                    // Assign group to file
                    var g, e, s;
                    loop1:
                        for (g = 0; g < groups.length; g++) {

                            loop2:
                                for (e = 0; e < groups[g].entities.length; e++) {

                                    if (groups[g].entities[e] === parent.entity) {

                                        if (!groups[g].firstElementExist) { // If a file first in the group, attach to it group name to display

                                            parent.first = groups[g].name;
                                            groups[g].firstElementExist = true;

                                        }

                                        parent.order = g; // Set a group order position

                                        // Divide children into subgroups
                                        if (parent.entity === "ui.listlayout" || parent.entity === "ui.reportlayout") {
                                            var subGroupsList = groups[g].subGroups[parent.entity];

                                            var children = parent.content;

                                            children.forEach(function (child) {

                                                for (s = 0; s < subGroupsList.length; s++) {

                                                    if (child.content_type === subGroupsList[s].content_type) {

                                                        if (!subGroupsList[s].firstElementExist) {
                                                            child.first = subGroupsList[s].name;
                                                            subGroupsList[s].firstElementExist = true;
                                                        }

                                                        child.order = s;
                                                    }

                                                }

                                            });
                                        }
                                        // < Divide children into subgroups >

                                        break loop1;
                                    }

                                }
                        }
                    // < Assign group to file >
                });

                findDynamicAttributesInLayouts();

            });

        };

        var findDynamicAttributesInLayouts = function () {

            var dynamicAttrsGroupIndex = 4;

            var layoutsList = {};

            var i;
            for (i = 0; i < vm.items.length; i++) {

                if (vm.items[i].entity === "ui.listlayout") {
                    layoutsList = vm.items[i];
                    break;
                }

            }

            if (layoutsList && layoutsList !== {}) {

                vm.items.forEach(function (entityItem) {

                    if (entityItem.order === dynamicAttrsGroupIndex) {

                        var matchingLayout = "";
                        switch (entityItem.entity) {
                            case "obj_attrs.portfolioattributetype":
                                matchingLayout = "portfolios.portfolio";
                                break;
                            case "obj_attrs.accountattributetype":
                                matchingLayout = "accounts.account";
                                break;
                            case "obj_attrs.accounttypeattributetype":
                                matchingLayout = "accounts.accounttype";
                                break;
                            case "obj_attrs.responsibleattributetype":
                                matchingLayout = "counterparties.responsible";
                                break;
                            case "obj_attrs.counterpartyattributetype":
                                matchingLayout = "counterparties.counterparty";
                                break;
                            case "obj_attrs.instrumentattributetype":
                                matchingLayout = "instruments.instrument";
                                break;
                            case "obj_attrs.instrumenttypeattributetype":
                                matchingLayout = "instruments.instrumenttype";
                                break;
                        }

                        entityItem.content.forEach(function (attr) {
                            var daName = attr.name;
                            var daUserCode = attr.user_code;
                            var usagesCount = 0;

                            layoutsList.content.forEach(function (layout) {

                                if (layout.content_type === matchingLayout) { // to determine whether layout and attribute have same entity
                                    var layoutColumns = layout.data.columns;
                                    var layoutGroups = layout.data.grouping;
                                    var attributeIsUsed = false;

                                    var l;
                                    for (l = 0; l < layoutColumns.length; l++) {

                                        if (layoutColumns[l].hasOwnProperty("user_code")) {

                                            if (layoutColumns[l].name === daName && layoutColumns[l].user_code === daUserCode) {
                                                attributeIsUsed = true;
                                                break;
                                            }
                                        }

                                    }

                                    if (!attributeIsUsed) {

                                        var g;
                                        for (g = 0; g < layoutGroups.length; g++) {

                                            if (layoutGroups[g].hasOwnProperty("user_code")) {

                                                if (layoutGroups[g].name === daName && layoutGroups[g].user_code === daUserCode) {
                                                    attributeIsUsed = true;
                                                    break;
                                                }
                                            }

                                        }

                                    }

                                    if (attributeIsUsed) {
                                        entityItem.attributeIsUsed = true;
                                        usagesCount = usagesCount + 1;
                                        attr.countOfUsages = usagesCount;
                                    }

                                }

                            })

                        });
                    }
                });

            }
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
                delete entity.attributeIsUsed;

                entity.content.forEach(function (item) {

                    delete item.order;
                    delete item.first;
                    delete item.countOfUsages;

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