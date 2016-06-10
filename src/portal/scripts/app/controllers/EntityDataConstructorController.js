/**
 * Created by szhitenev on 30.05.2016.
 */
(function () {

    'use strict';

    var demoPortfolioService = require('../services/demo/demoPortfolioService');
    var demoTransactionsService = require('../services/demo/demoTransactionsService');

    var portfolioService = require('../services/portfolioService');
    var metaService = require('../services/metaService');

    var gridHelperService = require('../services/gridHelperService');

    module.exports = function ($scope, $stateParams, $state, $mdDialog) {

        var vm = this;
        vm.view = {};
        vm.boxColumns = [1, 2, 3, 4, 5, 6];

        vm.entityType = "portfolio";

        demoPortfolioService.getView().then(function (data) {
            vm.view = data;
            vm.tabs = data.tabs;
            addRowForTab();
            console.log('vm tabs!', vm.tabs);
            $scope.$apply();
        });

        vm.attrs = [];
        vm.baseAttrs = [];

        vm.cancel = function () {
            $state.go('app.portfolio');
        };

        portfolioService.getAttributeTypeList().then(function (data) {
            vm.attrs = data.results;

            console.log('vm attrs', vm.attrs);
            metaService.getBaseAttrs().then(function (data) {
                vm.baseAttrs = data;
                $scope.$apply();
            });
        });

        vm.checkColspan = function (tab, row, column) {

            console.log('VM TAB', tab);

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
                            console.log('rowMap[keys[x]][z]', rowMap[keys[x]][z]);
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
                console.log('tab', tab);
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
            vm.view.tabs = vm.tabs;
            var i;
            for (i = 0; i < vm.tabs.length; i = i + 1) {
                removeLastRow(vm.tabs[i]);
            }
            demoPortfolioService.save(vm.view).then(function () {
                console.log('layout saved', vm.view);
                $state.go('app.portfolio');
                $scope.$apply();
            });
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
            vm.tabs.push({
                name: '',
                editState: true,
                layout: {
                    rows: 0,
                    columns: 1,
                    fields: []
                }
            })
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
        }

    }

}());