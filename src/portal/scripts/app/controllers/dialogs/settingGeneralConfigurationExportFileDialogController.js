/**
 * Created by szhitenev on 30.05.2016.
 */
(function () {

    'use strict';

    var metaContentTypesService = require('../../services/metaContentTypesService');
    var uiRepository = require('../../repositories/uiRepository');
    var metaService = require('../../services/metaService');
    var configurationService = require('../../services/configurationService');


    module.exports = function ($scope, $mdDialog, file) {

        var vm = this;

        vm.readyStatus = {content: false, layouts: false};
        vm.layouts = [];

        vm.selectAllState = false;

        vm.getFile = function () {

            return new Promise(function (resolve, reject) {
                configurationService.getConfigurationData().then(function (data) {

                    console.log('configurationService.getConfigurationData', data);

                    vm.file = data;
                    vm.items = data.body;

                    var groups = [];
                    metaService.getContentGroups("exportImportConfigGroups").then(function (data) {
                        groups = data;

                        vm.items.forEach(function (parent) {

                            parent.content = parent.content.filter(function (child) {

                                if (child.hasOwnProperty('user_code') && child.user_code === '-') {
                                    return false
                                }

                                if (child.hasOwnProperty('scheme_name') && child.scheme_name === '-') {
                                    return false
                                }

                                return true;

                            });

                            // Assign group to file
                            var g, e, s;
                            loop1:
                                for (g = 0; g < groups.length; g++) {

                                    loop2:
                                        for (e = 0; e < groups[g].entities.length; e++) {

                                            if (groups[g].entities[e] === parent.entity) {

                                                if (!groups[g].firstElementExist) { // If a file first in the group, attach to it group name to display

                                                    parent.first__ = groups[g].name;
                                                    groups[g].firstElementExist = true;

                                                }

                                                parent.order__ = g; // Set a group order position

                                                // Divide children into subgroups
                                                if (parent.entity === "ui.listlayout" || parent.entity === "ui.reportlayout") {
                                                    var subGroupsList = groups[g].subGroups[parent.entity];

                                                    var children = parent.content;

                                                    children.forEach(function (child) {

                                                       for (s = 0; s < subGroupsList.length; s++) {

                                                           if (child.content_type === subGroupsList[s].content_type) {

                                                               if (!subGroupsList[s].firstElementExist) {
                                                                   child.first__ = subGroupsList[s].name;
                                                                   subGroupsList[s].firstElementExist = true;
                                                               }

                                                               child.order__ = s;
                                                           }

                                                       }

                                                    });
                                                } else if (parent.entity === "transactions.transactiontype") {

                                                    groupByProperty(parent.content, '___group__user_code');

                                                }
                                                // < Divide children into subgroups >

                                                break loop1;
                                            }

                                        }
                                }
                            // < Assign group to file >

                        });

                        findDynamicAttributesInLayouts();

                        vm.readyStatus.content = true;
                        resolve($scope.$apply());

                    });

                });
            });
        };

        var groupByProperty = function (elements, propertyToGroupBy) {

            var hasFirstElement = [];

            elements.forEach(function (element) {

                if (element.hasOwnProperty(propertyToGroupBy)) {
                    var valueToGroupBy = element[propertyToGroupBy];

                    if (valueToGroupBy === "-") {
                        valueToGroupBy = "Transaction types without group";
                    }

                    if (hasFirstElement.indexOf(valueToGroupBy) === -1) {
                        element.first__ = valueToGroupBy;
                        hasFirstElement.push(valueToGroupBy);
                    }

                    element.order__ = valueToGroupBy;
                }

            });

        };

        var findDynamicAttributesInLayouts = function () {

            var dynamicAttrsGroupIndex = 4;

            var layoutsList = [];

            var i;
            for (i = 0; i < vm.items.length; i++) {

                if (vm.items[i].entity === "ui.listlayout" || vm.items[i].entity === "ui.reportlayout") { // create one array of all layouts
                    layoutsList = layoutsList.concat(vm.items[i].content);
                }

            }

            vm.items.map(function (entityItem) {

                if (entityItem.order__ === dynamicAttrsGroupIndex) {

                    var matchingLayout = ["reports.balancereport", "reports.plreport"];
                    switch (entityItem.entity) {
                        case "obj_attrs.portfolioattributetype":
                            matchingLayout.push("portfolios.portfolio");
                            break;
                        case "obj_attrs.accountattributetype":
                            matchingLayout.push("accounts.account");
                            break;
                        case "obj_attrs.accounttypeattributetype":
                            matchingLayout.push("accounts.accounttype");
                            break;
                        case "obj_attrs.responsibleattributetype":
                            matchingLayout.push("counterparties.responsible");
                            break;
                        case "obj_attrs.counterpartyattributetype":
                            matchingLayout.push("counterparties.counterparty");
                            break;
                        case "obj_attrs.instrumentattributetype":
                            matchingLayout.push("instruments.instrument");
                            break;
                        case "obj_attrs.instrumenttypeattributetype":
                            matchingLayout.push("instruments.instrumenttype");
                            break;
                    }

                    entityItem.content.map(function (attr) {
                        var daName = attr.name;
                        var daUserCode = attr.user_code;
                        var usagesCount = 0;

                        layoutsList.map(function (layout) {

                            if (matchingLayout.indexOf(layout.content_type) !== -1) { // to determine if it is possible for this layout can contain such an attribute
                                var layoutColumns = layout.data.columns;
                                var layoutGroups = layout.data.grouping;
                                var attributeIsUsed = false;
                                var attributeNameProperty = "name";

                                if (layout.content_type.indexOf("report") !== -1) { // use source_name when map layout of report
                                    attributeNameProperty = "source_name";
                                }

                                var l;
                                for (l = 0; l < layoutColumns.length; l++) {

                                    if (layoutColumns[l].hasOwnProperty("user_code")) {
                                        if (layoutColumns[l][attributeNameProperty] === daName && layoutColumns[l].user_code === daUserCode) {
                                            attributeIsUsed = true;
                                            break;
                                        }
                                    }

                                }

                                if (!attributeIsUsed) {

                                    var g;
                                    for (g = 0; g < layoutGroups.length; g++) {

                                        if (layoutGroups[g].hasOwnProperty("user_code")) {

                                            if (layoutGroups[g][attributeNameProperty] === daName && layoutGroups[g].user_code === daUserCode) {
                                                attributeIsUsed = true;
                                                break;
                                            }
                                        }

                                    }

                                }

                                if (attributeIsUsed) {
                                    entityItem.attributeIsUsed__ = true;
                                    usagesCount = usagesCount + 1;
                                    attr.countOfUsages__ = usagesCount;
                                }

                            }

                        })

                    });
                }
            });

        };

        var getECProperties = function (item) {

            var result = {};

            if (item.hasOwnProperty('name')) {
                result.name = item.name
            }

            if (item.hasOwnProperty('content_type')) {
                result.content_type = item.content_type
            }

            if (item.hasOwnProperty('user_code')) {
                result.user_code = item.user_code
            }

            if (item.hasOwnProperty('scheme_name')) {
                result.scheme_name = item.scheme_name
            }

            if (item.hasOwnProperty('cron_expr')) {
                result.cron_expr = item.cron_expr
            }

            return result;
        };

        vm.getConfigurationExportLayouts = function () {

            vm.readyStatus.layouts = false;

            uiRepository.getConfigurationExportLayoutList().then(function (data) {

                vm.layouts = data.results;

                if (vm.layouts.length) {

                    vm.activeLayout = vm.layouts[0];

                    vm.layouts.forEach(function (item) {
                        if (item.is_default) {
                            vm.activeLayout = item;
                        }
                    });
                }

                if (vm.activeLayout) {
                    vm.syncWithLayout();
                }

                vm.readyStatus.layouts = true;

                $scope.$apply();

            });

        };

        vm.deactivateAll = function () {

            vm.items.forEach(function (entityItem) {

                entityItem.active = false;
                entityItem.someChildsActive = false;

                entityItem.content.forEach(function (childItem) {
                    childItem.active = false;
                })

            });

        };

        vm.syncWithLayout = function () {

            vm.layouts.forEach(function (item) {
                item.is_default = false;
            });

            vm.activeLayout.is_default = true;

            vm.deactivateAll();

            vm.items.forEach(function (entityItem) {

                var layoutData = vm.activeLayout.data[entityItem.entity];

                if (layoutData && layoutData.length > 0) {

                    if (entityItem.content.length) {
                        entityItem.active = true;
                    }

                    entityItem.content.forEach(function (childItem) {

                        var searchItem = getECProperties(childItem);

                        layoutData.forEach(function (layoutDataItem) {

                            if (layoutDataItem) {

                                Object.keys(searchItem).forEach(function (key) {

                                    if (layoutDataItem[key] === searchItem[key]) {
                                        childItem.active = true;
                                        entityItem.someChildsActive = true;
                                    }

                                });

                            }

                        })


                    })

                }

            });

            vm.checkSelectAll();

        };

        vm.updateLayout = function ($event) {

            vm.items.forEach(function (item) {

                vm.activeLayout.data[item.entity] = [];

                item.content.forEach(function (child) {

                    if (child.active) {

                        var name = getECProperties(child);

                        if (name || typeof name === "string") {
                            vm.activeLayout.data[item.entity].push(name)
                        }
                    }

                });

            });

            $mdDialog.show({
                controller: 'SaveConfigurationExportLayoutDialogController as vm',
                templateUrl: 'views/dialogs/save-configuration-export-layout-dialog-view.html',
                targetEvent: $event,
                locals: {
                    data: {
                        layout: vm.activeLayout,
                    }
                },
                multiple: true,
                preserveScope: true,
                autoWrap: true,
                skipHide: true
            }).then(function (res) {

                if (res.status === 'agree') {
                    vm.getConfigurationExportLayouts();
                }
            })

        };

        vm.createLayout = function ($event) {

            var configuration = {};

            vm.items.forEach(function (item) {

                if (!configuration.hasOwnProperty(item.entity)) {
                    configuration[item.entity] = [];
                }

                item.content.forEach(function (child) {

                    if (child.active) {

                        var name = getECProperties(child);

                        configuration[item.entity].push(name)
                    }

                })

            });

            console.log('createLayout.configuration', configuration);

            $mdDialog.show({
                controller: 'SaveConfigurationExportLayoutDialogController as vm',
                templateUrl: 'views/dialogs/save-configuration-export-layout-dialog-view.html',
                targetEvent: $event,
                locals: {
                    data: {
                        layout: {
                            data: configuration
                        }
                    }
                },
                multiple: true,
                preserveScope: true,
                autoWrap: true,
                skipHide: true
            }).then(function (res) {

                if (res.status === 'agree') {
                    vm.getConfigurationExportLayouts();
                }
            });

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

        vm.getEntityName = function (item) {

            switch (item.entity) {
                case 'transactions.transactiontype':
                    return "Transaction Types";
                case 'transactions.transactiontypegroup':
                    return "Transaction Type Groups";
                case 'accounts.accounttype':
                    return "Account Types";
                case 'currencies.currency':
                    return 'Currencies';
                case 'instruments.pricingpolicy':
                    return "Pricing Policy";
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
                    return "Data import from CSV schemes";
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

            // transactions.transactiontype, transactions.transactiontypegroup, currencies.currency, instruments.pricingpolicy, instruments.instrumenttype, all dynamic attrs (obj_attrs)
            if (item.hasOwnProperty('user_code')) {
                var result = item.user_code;

                if (item.hasOwnProperty('scheme_name')) { // integrations.instrumentdownloadscheme
                    result = item.scheme_name;
                }

                return result;
            }

            // integrations.pricedownloadscheme, integrations.complextransactionimportscheme,
            if (item.hasOwnProperty('scheme_name')) {
                return item.scheme_name;
            }

            if (item.hasOwnProperty('name')) {

                // csv_import.scheme
                if (item.hasOwnProperty('csv_fields')) {
                    return item.name + ' (' + metaContentTypesService.getEntityNameByContentType(item.content_type) + ')'
                }

                // ui.listlayout, ui.reportlayout
                if (item.hasOwnProperty('data')) {

                    // ui.bookmark
                    if (item.hasOwnProperty('___content_type')) {

                        /*if (item.hasOwnProperty('children') && item.children.length > 0) {
                            // return 'Bookmarks - Upper Layer (' + item.name + ')'
                            return "&folder;" + ' ' + item.name
                        } else {
                            return item.name
                        }*/
                        return item.name
                    }

                    // return item.name + ' (' + metaContentTypesService.getEntityNameByContentType(item.content_type) + ')'
                    return item.name
                }

                return item.name
            }

            // ui.editlayout
            if (item.hasOwnProperty('content_type')) {
                return metaContentTypesService.getEntityNameByContentType(item.content_type)
            }

            // import.pricingautomatedschedule
            if (item.hasOwnProperty('last_run_at')) {
                return "Schedule"
            }

        };

        vm.checkForTextIcon = function (parentEntity, child) {
            if (parentEntity === "ui.bookmark") {
                if (child.children.length > 0) {
                    return true;
                }
            }
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
            });

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

        /*function isEntitySelected(entity) {

            var result = false;

            entity.content.forEach(function (item) {

                if (item.active) {
                    result = true;
                }

            });

            return result;

        }

        function findEntity(items, entityName) {

            var result;

            items.forEach(function (item) {

                if (item.entity === entityName) {
                    result = item;
                }

            });

            return result;

        }*/

        function exportConfiguration(items) {

            return new Promise(function (resolve, reject) {

                var results = [];

                vm.items.forEach(function (item) {

                    var result = {
                        entity: item.entity,
                        content: [],
                        dependencies: item.dependencies,
                        count: 0
                    };

                    item.content.forEach(function (child) {

                        if (child.active) {
                            result.content.push(child)
                        }

                    });

                    result.count = result.content.length;

                    if (result.count > 0) {
                        results.push(result)
                    }

                });

                vm.file.body = results;

                var resultFile = JSON.stringify(vm.file);

                var a = document.getElementById("exportButton");
                var result = new File([resultFile], {type: 'text/json;charset=utf-8'});

                a.href = URL.createObjectURL(result);
                a.download = vm.filename ? vm.filename + '.json' : "configuration.json";

                resolve(vm.file);

            })

        }

        vm.agree = function ($event) {

            // removing properties created for data rendering
            vm.items.forEach(function (entity) {
                delete entity.order__;
                delete entity.first__;
                delete entity.attributeIsUsed__;

                entity.content.forEach(function (item) {
                    delete item.order__;
                    delete item.first__;
                    delete item.countOfUsages__;
                });

            });

            exportConfiguration(vm.items).then(function (data) {

                $mdDialog.hide({status: 'agree', data: {}});

            })

        };

        vm.cancel = function () {
            $mdDialog.cancel();
        };

        vm.init = function () {

            vm.getFile().then(function () {
                vm.getConfigurationExportLayouts();
            })

        };

        vm.init();

    }

}());