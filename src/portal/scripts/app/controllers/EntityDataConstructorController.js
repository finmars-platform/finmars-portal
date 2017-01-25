/**
 * Created by szhitenev on 30.05.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../core/services/logService');
    var attributeTypeService = require('../services/attributeTypeService');

    var uiService = require('../services/uiService');

    var portfolioService = require('../services/portfolioService');
    var entityResolverService = require('../services/entityResolverService');
    var metaService = require('../services/metaService');

    var gridHelperService = require('../services/gridHelperService');
    var routeResolver = require('../services/routeResolverService');

    module.exports = function ($scope, $stateParams, $state, $mdDialog) {

        logService.controller('EntityDataConstructorController', 'initialized');

        var vm = this;
        vm.boxColumns = [1, 2, 3, 4, 5, 6];
        vm.readyStatus = {constructor: false};
        vm.uiIsDefault = false;

        vm.attrs = [];
        vm.baseAttrs = [];
        vm.entityAttrs = [];
        vm.userInputs = [];

        console.log($stateParams);

        vm.entityType = $stateParams.entityType;
        vm.isntanceId = $stateParams.instanceId;

        // weirdo stuff
        // we took edit layout by instance id instead of entity content_type
        // but it can be taken from different entity
        // e.g. transaction -> transaction-type.book_transaction_layout

        if (vm.isntanceId) {
            uiService.getEditLayoutByInstanceId(vm.entityType, vm.isntanceId).then(function (data) {
                //console.log(data['json_data']);
                if (data) {
                    vm.ui = data;
                } else {
                    vm.uiIsDefault = true;
                    vm.ui = uiService.getDefaultEditLayout()[0];
                }
                vm.tabs = vm.ui.data || [];
                vm.tabs.forEach(function (tab) {
                    tab.layout.fields.forEach(function (field) {
                        field.editMode = false;
                    })
                });
                addRowForTab();
                //logService.collection('vm tabs', vm.tabs);
                $scope.$apply();
            });
        } else {
            uiService.getEditLayout(vm.entityType).then(function (data) {
                //console.log(data['json_data']);
                if (data.results.length) {
                    vm.ui = data.results[0];
                } else {
                    vm.uiIsDefault = true;
                    vm.ui = uiService.getDefaultEditLayout()[0];
                }
                vm.tabs = vm.ui.data;
                vm.tabs.forEach(function (tab) {
                    tab.layout.fields.forEach(function (field) {
                        field.editMode = false;
                    })
                });
                addRowForTab();
                //logService.collection('vm tabs', vm.tabs);
                $scope.$apply();
            });
        }

        if (vm.isntanceId) {
            if (vm.entityType === 'complex-transaction') {
                entityResolverService.getByKey('transaction-type', vm.isntanceId).then(function (data) {
                    var inputs = data.inputs;
                    inputs.forEach(function (input) {
                        var input_value_type = input.value_type;
                        if (input.value_type == 100) {
                            input_value_type = 'field'
                        }

                        var contentType = undefined;
                        var uniqueKey = input.name.split(' ').join('_').toLowerCase();

                        if (input.content_type && input.content_type !== undefined) {
                            contentType = input.content_type.split('.')[1];
                            uniqueKey = input.name.split(' ').join('_').toLowerCase() + '_' + input.content_type;
                        } else {
                            contentType = input.name.split(' ').join('_').toLowerCase();
                        }

                        vm.userInputs.push({
                            unique_key: uniqueKey,
                            key: contentType,
                            name: input.name,
                            content_type: input.content_type,
                            value_type: input_value_type
                        })
                    });
                    $scope.$apply();
                });
            }
        }

        vm.cancel = function () {
            $state.go('app.data.' + vm.entityType);
        };

        attributeTypeService.getList(vm.entityType).then(function (data) {
            logService.collection('data', data);
            vm.attrs = data.results;

            logService.collection('vm attrs', vm.attrs);

            if (metaService.getEntitiesWithoutBaseAttrsList().indexOf(vm.entityType) === -1) {
                vm.baseAttrs = metaService.getBaseAttrs();
            }
            logService.collection('vm.baseAttrs', vm.baseAttrs);
            vm.entityAttrs = metaService.getEntityAttrs(vm.entityType);
            logService.collection('vm.entityAttrs', vm.entityAttrs);
            vm.readyStatus.constructor = true;
            $scope.$apply();
        });

        vm.checkColspan = function (tab, row, column) {

            //console.log('VM TAB', tab);

            var i, c;

            var rowMap = [];
            var startColumn;
            var colspans;

            for (i = 0; i < tab.layout.fields.length; i = i + 1) {
                if (tab.layout.fields[i].row == row) {
                    startColumn = tab.layout.fields[i].column;
                    colspans = parseInt(tab.layout.fields[i].colspan, 10);
                    for (c = 0; c < colspans; c = c + 1) {
                        if (!rowMap[startColumn]) {
                            rowMap[startColumn] = [];
                        }
                        rowMap[startColumn].push(parseInt(startColumn, 10) + parseInt(c, 10));
                    }
                }
            }

            var x, z;
            var keys = Object.keys(rowMap);

            for (x = 0; x < keys.length; x = x + 1) {
                if (keys[x] === column) {
                    return true;
                } else {
                    for (z = 1; z < rowMap[keys[x]].length; z = z + 1) {
                        if (column == rowMap[keys[x]][z]) {
                            //console.log('rowMap[keys[x]][z]', rowMap[keys[x]][z]);
                            return false;
                        }
                    }
                }
            }

            return true;

        };

        vm.range = gridHelperService.range;

        function addRowForTab() {
            var i;
            for (i = 0; i < vm.tabs.length; i = i + 1) {
                addRow(vm.tabs[i]);
            }
        }

        function addRow(tab) {
            var c;
            tab.layout.rows = tab.layout.rows + 1;
            for (c = 0; c < tab.layout.columns; c = c + 1) {
                tab.layout.fields.push({
                    row: tab.layout.rows,
                    column: c + 1,
                    colspan: 1,
                    type: 'empty'
                })
            }
        }

        function removeLastRow(tab) {
            var f;
            for (f = 0; f < tab.layout.fields.length; f = f + 1) {
                if (tab.layout.fields[f].row === tab.layout.rows) {
                    tab.layout.fields.splice(f, 1);
                    f = f - 1;
                }
            }

            tab.layout.rows = tab.layout.rows - 1;
        }

        vm.setLayoutColumns = function (tab, columns, ev) {

            if (columns < tab.layout.columns) {
                var losedColumns = [];
                var i;
                for (i = columns; i < tab.layout.columns; i = i + 1) {
                    losedColumns.push(i + 1);
                }
                var description;
                if (losedColumns.length > 1) {
                    description = 'If you switch to less number of columns you lose data of ' + losedColumns.join(', ') + ' columns'
                } else {
                    description = 'If you switch to less number of columns you lose data of ' + losedColumns.join(', ') + ' column'
                }
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
                    if (res.status === 'agree') {
                        var i, r, c;
                        for (i = 0; i < tab.layout.fields.length; i = i + 1) {
                            for (r = 0; r < tab.layout.rows; r = r + 1) {
                                for (c = columns; c < tab.layout.columns; c = c + 1) {
                                    if (tab.layout.fields[i].row == r + 1 && tab.layout.fields[i].column == c + 1) {
                                        tab.layout.fields.splice(i, 1);
                                    }
                                }
                            }
                        }

                        tab.layout.columns = columns;
                    }
                });
            } else {

                var r, c;

                for (r = 1; r <= tab.layout.rows; r = r + 1) {
                    for (c = tab.layout.columns + 1; c <= columns; c = c + 1) {
                        tab.layout.fields.push({
                            row: r,
                            column: c,
                            colspan: 1,
                            type: 'empty'
                        })
                    }
                }
                tab.layout.columns = columns;
            }

        };

        vm.saveLayout = function () {
            var i;
            for (i = 0; i < vm.tabs.length; i = i + 1) {
                removeLastRow(vm.tabs[i]);
            }
            vm.ui.data = vm.tabs;
            if (vm.uiIsDefault) {
                if (vm.isntanceId) {
                    uiService.updateEditLayoutByInstanceId(vm.entityType, vm.isntanceId, vm.ui).then(function (data) {
                        console.log('layout saved');
                        var route;
                        if (vm.entityType === 'complex-transaction') {
                            route = routeResolver.findExistingState('app.data.', 'transaction-type');
                        } else {
                            route = routeResolver.findExistingState('app.data.', vm.entityType);
                        }
                        $state.go(route.state, route.options);
                        $scope.$apply();
                    });
                } else {
                    uiService.createEditLayout(vm.entityType, vm.ui).then(function () {
                        console.log('layout saved');

                        var route = routeResolver.findExistingState('app.data.', vm.entityType);
                        $state.go(route.state, route.options);
                        $scope.$apply();
                    });
                }
            } else {
                if (vm.isntanceId) {
                    uiService.updateEditLayoutByInstanceId(vm.entityType, vm.isntanceId, vm.ui).then(function (data) {
                        console.log('layout saved');

                        var route;
                        if (vm.entityType === 'complex-transaction') {
                            route = routeResolver.findExistingState('app.data.', 'transaction-type');
                        } else {
                            route = routeResolver.findExistingState('app.data.', vm.entityType);
                        }
                        $state.go(route.state, route.options);
                        $scope.$apply();
                    });
                } else {
                    uiService.updateEditLayout(vm.ui.id, vm.ui).then(function () {
                        console.log('layout saved');

                        var route = routeResolver.findExistingState('app.data.', vm.entityType);
                        $state.go(route.state, route.options);
                        $scope.$apply();
                    });
                }
            }
        };

        vm.bindFlex = function (tab, row, column) {
            var totalColspans = 0;
            var i;
            var field;
            for (i = 0; i < tab.layout.fields.length; i = i + 1) {
                if (tab.layout.fields[i].row === row) {
                    if (tab.layout.fields[i].column === column) {
                        field = tab.layout.fields[i];
                    }

                    totalColspans = totalColspans + parseInt(tab.layout.fields[i].colspan, 10);
                }
            }
            var flexUnit = 100 / tab.layout.columns;
            if (field) {
                return Math.floor(field.colspan * flexUnit);
            }
            return Math.floor(flexUnit);
        };

        vm.deleteTab = function (tab) {
            var i;
            for (i = 0; i < vm.tabs.length; i = i + 1) {
                if (tab.name === vm.tabs[i].name) {
                    vm.tabs.splice(i, 1);
                    break;
                }
            }
        };

        vm.addTab = function () {
            if (!vm.tabs.length) {
                vm.tabs = [];
            }
            vm.tabs.push({
                name: '',
                editState: true,
                layout: {
                    rows: 0,
                    columns: 1,
                    fields: []
                }
            });
            addRow(vm.tabs[vm.tabs.length - 1]);
        };

        vm.toggleEditTab = function (tab, action, $index) {
            if (!tab.editState) {
                tab.editState = false;
            }
            if (!tab.captionName) {
                tab.captionName = tab.name;
            }
            if (action === 'back') {
                console.log('??');
                if (!tab.captionName && tab.name === '') {
                    vm.tabs.splice($index, 1);
                } else {
                    tab.captionName = tab.name;
                }
            }
            tab.editState = !tab.editState;
        };

        vm.saveEditedTab = function (tab) {
            console.log(tab);
            if (tab.captionName !== '') {
                tab.name = tab.captionName;
                tab.editState = !tab.editState;
            }
        };

        vm.MABtnVisibility = function (entityType) {
            return metaService.checkRestrictedEntityTypesForAM(entityType);
        }

    }

}());