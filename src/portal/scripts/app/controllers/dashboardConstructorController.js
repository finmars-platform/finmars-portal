/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    var uiService = require('../services/uiService');
    var md5Helper = require('../helpers/md5.helper');

    var DashboardConstructorDataService = require('../services/dashboard-constructor/dashboardConstructorDataService')
    var DashboardConstructorEventService = require('../services/dashboard-constructor/dashboardConstructorEventService')

    module.exports = function ($scope, $stateParams, $state, $mdDialog) {

        var vm = this;

        vm.readyStatus = {
            data: false
        };

        vm.dashboardConstructorDataService = null;
        vm.dashboardConstructorEventService = null;

        vm.availableComponentsTypes = [];

        vm.layout = {
            name: '',
            data: {
                fixed_area: {
                    status: 'disabled',
                    position: 'top',
                    data: []
                },
                tabs: [],
                components_types: [
                    {
                        name: 'Report Component',
                        type: 'report_viewer',
                        id: '001',
                        settings: {}
                    },
                    {
                        name: 'Date Control 1',
                        type: 'control',
                        id: '123',
                        settings: {
                            value_type: 40
                        }
                    },
                    {
                        name: 'Currency Control 2',
                        type: 'control',
                        id: '456',
                        settings: {
                            value_type: 100,
                            content_type: 'currencies.currency'
                        }
                    },
                    {
                        name: 'Portfolio Control 2',
                        type: 'control',
                        id: '789',
                        settings: {
                            value_type: 100,
                            content_type: 'portfolios.portfolio'
                        }
                    }
                ]
            }
        };

        vm.generateId = function (str) {

            return md5Helper.md5(str)

        };

        vm.deleteTab = function (tab) {

            var i;
            for (i = 0; i < vm.layout.data.tabs.length; i = i + 1) {
                if (tab.tab_number === vm.layout.data.tabs[i].tab_number) {
                    vm.layout.data.tabs.splice(i, 1);
                    break;
                }
            }

            vm.updateTabNumbers();
            vm.updateAvailableComponentsTypes();

        };

        vm.addTab = function () {

            var id = vm.generateId(new Date().getTime() + '_' + vm.layout.data.tabs.length);

            var tab = {
                name: '',
                editState: true,
                id: id,
                tab_number: vm.layout.data.tabs.length,
                layout: {
                    rows_count: null,
                    columns_count: null,
                    rows: []
                }
            };

            var columns_count = 6;
            var rows_count = 6;

            for (var r = 0; r < rows_count; r = r + 1) {

                tab.layout.rows[r] = {
                    row_number: r,
                    columns: []
                };

                for (var c = 0; c < columns_count; c = c + 1) {

                    tab.layout.rows[r].columns[c] = {
                        column_number: c,
                        cell_type: 'empty',
                        data: {}
                    }

                }

            }

            tab.layout.rows_count = rows_count;
            tab.layout.columns_count = columns_count;

            vm.layout.data.tabs.push(tab);

            vm.updateTabNumbers();
            vm.updateAvailableComponentsTypes();
            vm.updateDrakeContainers();

        };

        vm.toggleEditTab = function (tab, action, $index) {
            if (!tab.editState) {
                tab.editState = false;
            }
            if (!tab.captionName) {
                tab.captionName = tab.name;
            }
            if (action === 'back') {

                if (!tab.captionName && tab.name === '') {
                    vm.layout.data.tabs.splice($index, 1);
                } else {
                    tab.captionName = tab.name;
                }
            }
            tab.editState = !tab.editState;
        };

        vm.saveEditedTab = function (tab) {
            console.log(tab);
            var tabIsReadyToSave = true;

            if (tab.captionName && tab.captionName !== '') {

                vm.layout.data.tabs.forEach(function (singleTab) {

                    if (tab.captionName.toLowerCase() === singleTab.name.toLowerCase()) {
                        tabIsReadyToSave = false;
                    }
                });

                if (tabIsReadyToSave) {
                    tab.name = tab.captionName;
                    tab.editState = !tab.editState;
                }
            } else {
                tabIsReadyToSave = false;
            }

            if (!tabIsReadyToSave) {

                $mdDialog.show({
                    controller: 'WarningDialogController as vm',
                    templateUrl: 'views/warning-dialog-view.html',
                    // targetEvent: $event,
                    autoWrap: true,
                    skipHide: true,
                    preserveScope: true,
                    multiple: true,
                    locals: {
                        warning: {
                            title: 'Warning!',
                            description: 'Name of the tab must make a unique character set.'
                        }
                    }
                });
            }
        };

        vm.getVerboseType = function (item) {

            if (item.type === 'report_viewer') {
                return 'Report Viewer'
            }

            if (item.type === 'report_viewer_split_panel') {
                return 'Report Viewer Split Panel'
            }

            if (item.type === 'entity_viewer') {
                return 'Entity Viewer'
            }

            if (item.type === 'entity_viewer_split_panel') {
                return 'Entity Viewer Split Panel'
            }

            if (item.type === 'input_form') {
                return 'Input Form'
            }

            if (item.type === 'control') {
                return 'Control'
            }

            if (item.type === 'button_set') {
                return 'Button Set'
            }

            return 'Unknown'

        };

        vm.goToDashboard = function () {
            $state.go('app.dashboard')
        };

        vm.initDragAndDrop = function () {

            vm.dragAndDrop = {

                drake: null,

                init: function () {

                    var items = vm.getDrakeContainers();

                    this.drake = dragula(items,
                        {
                            accepts: function (el, target, source, sibling) {

                                if (target.classList.contains('.dashboard-constructor-draggable-card')) {
                                    return false;
                                }

                                return true;
                            },
                            copy: true
                        });

                    this.eventListeners();
                },

                eventListeners: function () {
                    var that = this;
                    this.drake.on('over', function (elem, container, source) {
                        $(container).addClass('active');
                        $(container).on('mouseleave', function () {
                            $(this).removeClass('active');
                        })

                    });

                    this.drake.on('out', function (elem, container, source) {
                        $(container).removeClass('active')

                    });
                    this.drake.on('drop', function (elem, target) {

                        console.log('target', {target: target});
                        console.log('elem', {elem: elem});

                        $(target).removeClass('active');

                        if (target) {

                            if (target.classList.contains('dashboard-constructor-empty-cell')) {

                                var component_id = elem.dataset.componentId;

                                var component = vm.layout.data.components_types.find(function (item) {

                                    return item.id === component_id

                                });

                                var data_source = target.parentElement.parentElement; // root of the cell (.dashboard-constructor-cell)

                                var tab_number = parseInt(data_source.dataset.tab, 10);
                                var row_number = parseInt(data_source.dataset.row, 10);
                                var column_number = parseInt(data_source.dataset.column, 10);

                                console.log('tab_number', tab_number);
                                console.log('row_number', row_number);
                                console.log('column_number', column_number);

                                vm.layout.data.tabs.forEach(function (tab) {

                                    if (tab.tab_number === tab_number) {

                                        tab.layout.rows.forEach(function (row) {

                                            row.columns.forEach(function (column) {

                                                if (column.column_number === column_number && row.row_number === row_number) {

                                                    column.cell_type = 'component';

                                                    column.data = component

                                                }

                                            })


                                        });

                                    }

                                });

                                vm.updateAvailableComponentsTypes();

                                $scope.$apply();

                            }

                        }

                        $scope.$apply();
                    });

                    this.drake.on('dragend', function (el) {
                        $scope.$apply();
                        $(el).remove();
                    })
                },

                destroy: function () {
                    // console.log('this.dragula', this.dragula)
                    this.drake.destroy();

                }
            };

            vm.dragAndDrop.init();

        };

        vm.getDrakeContainers = function () {

            var items = [];

            var emptyFieldsElem = document.querySelectorAll('.dashboard-constructor-empty-cell');
            for (i = 0; i < emptyFieldsElem.length; i = i + 1) {
                items.push(emptyFieldsElem[i]);
            }

            var i;
            var cardsElem = document.querySelectorAll('.dashboard-constructor-draggable-card');
            for (i = 0; i < cardsElem.length; i = i + 1) {
                items.push(cardsElem[i]);
            }

            return items;

        };

        vm.updateDrakeContainers = function () {

            if (vm.dragAndDrop.drake) {

                setTimeout(function () {

                    vm.dragAndDrop.drake.containers = [];
                    vm.dragAndDrop.drake.containers = vm.getDrakeContainers();

                }, 500);

            }

        };

        vm.updateAvailableComponentsTypes = function () {

            var componentsInUse = [];

            vm.layout.data.tabs.forEach(function (tab) {

                tab.layout.rows.forEach(function (row) {

                    row.columns.forEach(function (column) {

                        if (column.cell_type === 'component') {
                            componentsInUse.push(column.data.id)
                        }

                    })

                })

            });


            vm.availableComponentsTypes = vm.layout.data.components_types.filter(function (component) {

                return componentsInUse.indexOf(component.id) === -1

            })

        };

        vm.updateTabNumbers = function () {

            vm.layout.data.tabs = vm.layout.data.tabs.map(function (tab, index) {
                tab.tab_number = index;

                return tab
            })

        };

        vm.isRowEmpty = function (row) {

            var result = true;

            row.columns.forEach(function (column) {

                if (column.cell_type !== 'empty') {
                    result = false;
                }

            });

            return result

        };

        vm.deleteRow = function (tab, row) {

            vm.layout.data.tabs = vm.layout.data.tabs.map(function (layoutTab) {

                if (tab.id === layoutTab.id) {

                    tab.layout.rows = tab.layout.rows.filter(function (tabRow) {

                        if (row.row_number === tabRow.row_number) {
                            return false
                        }

                        return true

                    });

                    tab.layout.rows_count = tab.layout.rows.length


                }

                return layoutTab

            });

            vm.updateDrakeContainers();

        };

        vm.insertRow = function (tab, row) {

            vm.layout.data.tabs = vm.layout.data.tabs.map(function (layoutTab) {

                if (tab.id === layoutTab.id) {

                    var newRow = {
                        row_number: row.row_number + 1,
                        columns: []
                    };

                    for (var c = 0; c < layoutTab.layout.columns_count; c = c + 1) {

                        newRow.columns[c] = {
                            column_number: c,
                            cell_type: 'empty',
                            data: {}
                        }
                    }

                    layoutTab.layout.rows.splice(newRow.row_number, 0, newRow);

                    layoutTab.layout.rows = layoutTab.layout.rows.map(function (row, index) {

                        row.row_number = index;

                        return row
                    });

                    layoutTab.layout.row_number = layoutTab.layout.rows.length;

                }

                return layoutTab

            });

            vm.updateDrakeContainers();

        };

        vm.getLayout = function () {

            vm.readyStatus.data = false;

            uiService.getDashboardLayoutByKey(vm.layout.id).then(function (data) {

                vm.layout = data;

                vm.updateAvailableComponentsTypes();

                vm.readyStatus.data = true;

                console.log('vm.layout', vm.layout);

                $scope.$apply(function () {

                    setTimeout(function () {
                        vm.initDragAndDrop();
                    }, 500);


                });

            })

        };

        vm.saveLayout = function ($event) {

            if (vm.layout.id) {

                uiService.updateDashboardLayout(vm.layout.id, vm.layout).then(function (data) {

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
                                description: "Dashboard Layout is Saved"
                            }
                        }
                    });

                    $scope.$apply();

                })

            } else {

                uiService.createDashboardLayout(vm.layout).then(function (data) {

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
                                description: "Dashboard Layout is Saved"
                            }
                        }
                    });

                    $scope.$apply();

                })

            }

        };

        vm.toggleFieldEditMode = function (item) {

            vm.layout.data.tabs = vm.layout.data.tabs.map(function (tab) {

                tab.layout.rows = tab.layout.rows.map(function (row) {

                    row.columns = row.columns.map(function (item) {

                        item.editMode = false;

                        return item
                    });

                    return row

                });

                return tab
            });

            item.editMode = true;

        };

        vm.cancelFieldEdit = function (item) {

        };

        vm.saveField = function (item) {

            var i;
            for (i = 0; i < scope.tab.layout.fields.length; i = i + 1) {

                if (scope.tab.layout.fields[i].row === scope.item.row &&
                    scope.tab.layout.fields[i].column === scope.item.column) {

                    scope.tab.layout.fields[i].attribute_class = 'userInput';

                    if (scope.item.attribute.hasOwnProperty('id')) {
                        scope.tab.layout.fields[i].attribute_class = 'attr';
                        scope.tab.layout.fields[i].id = scope.item.attribute.id;
                    }

                    if (entityAttrsKeys.indexOf(scope.item.attribute.key) !== -1) {
                        scope.tab.layout.fields[i].attribute_class = 'entityAttr';
                    }

                    if (layoutAttrsKeys.indexOf(scope.item.attribute.key) !== -1) {
                        scope.tab.layout.fields[i].attribute_class = 'decorationAttr';
                    }

                    if (scope.item.options) {
                        scope.tab.layout.fields[i].options = scope.item.options;
                    }


                    scope.tab.layout.fields[i].name = scope.item.attribute.name;
                    scope.tab.layout.fields[i].type = 'field';
                    scope.tab.layout.fields[i].colspan = scope.item.colspan;
                    scope.tab.layout.fields[i].attribute = scope.item.attribute;

                    if (scope.item.editable) { // its important
                        scope.tab.layout.fields[i].editable = true
                    } else {
                        scope.tab.layout.fields[i].editable = false
                    }

                    if (scope.fieldUsesBackgroundColor) {
                        scope.tab.layout.fields[i].backgroundColor = scope.fieldBackgroundColor;
                    } else {
                        scope.tab.layout.fields[i].backgroundColor = null;
                    }

                    if (scope.tab.layout.fields[i].row === scope.tab.layout.rows) {
                        addRow();
                    }
                }
            }

            scope.item.editMode = false;

            scope.$parent.vm.createFieldsTree();
            scope.$parent.vm.syncItems();

        };

        vm.getCols = function () {

            var colsLeft = [1];
            var row = scope.tabFieldsTree[scope.row];
            var columnsInTotal = scope.tab.layout.columns;

            var i;
            var c = 1;
            for (i = scope.column + 1; i <= columnsInTotal; i++) {

                if (row[i].type !== 'empty') {
                    break;
                } else {
                    c = c + 1;
                    colsLeft.push(c);
                }
            }

            return colsLeft;

        };

        vm.deleteField = function (item, tab_number, row_number, column_number) {

            console.log('item', item);
            console.log('tab_number', tab_number);
            console.log('row_number', row_number);
            console.log('column_number', column_number);

            vm.layout.data.tabs = vm.layout.data.tabs.map(function (tab) {

                if (tab.tab_number === tab_number) {

                    tab.layout.rows = tab.layout.rows.map(function (row) {

                        if (row.row_number === row_number) {

                            row.columns = row.columns.map(function (item) {

                                if (item.column_number === column_number) {

                                    var result = {
                                        column_number: column_number,
                                        cell_type: 'empty',
                                        data: {},
                                        options: {}
                                    };

                                    return result

                                }

                                return item
                            });

                        }

                        return row

                    });

                }

                return tab

            });

            vm.updateAvailableComponentsTypes();
            vm.updateDrakeContainers();

        };

        vm.init = function () {

            vm.dashboardConstructorDataService = new DashboardConstructorDataService();
            vm.dashboardConstructorEventService = new DashboardConstructorEventService();

            if ($stateParams.id && $stateParams.id !== 'new') {

                vm.layout.id = $stateParams.id;

                vm.getLayout();

            } else {

                vm.readyStatus.data = true;

                setTimeout(function () {
                    vm.initDragAndDrop();
                }, 500);

                console.log('vm.layout', vm.layout)
            }

        };

        vm.init();

    }

}());