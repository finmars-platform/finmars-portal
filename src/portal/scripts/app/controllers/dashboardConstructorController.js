/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    var uiService = require('../services/uiService');
    var md5Helper = require('../helpers/md5.helper');

    var DashboardConstructorDataService = require('../services/dashboard-constructor/dashboardConstructorDataService');
    var DashboardConstructorEventService = require('../services/dashboard-constructor/dashboardConstructorEventService');

    var AttributeDataService = require('../services/attributeDataService');

    var dashboardConstructorEvents = require('../services/dashboard-constructor/dashboardConstructorEvents');

    module.exports = function ($scope, $stateParams, $state, $mdDialog) {

        var vm = this;

        vm.readyStatus = {
            data: false,
            attributes: false,
            tabs: false
        };

        vm.dashboardConstructorDataService = null;
        vm.dashboardConstructorEventService = null;

        vm.availableComponentsTypes = [];

        vm.layout = {
            name: '',
            data: {
                layout_type: null,
                fixed_area: {
                    status: 'disabled',
                    position: 'top',
                    layout: {
                        rows_count: null,
                        columns_count: null,
                        rows: []
                    }
                },
                tabs: [],
                components_types: []
            }
        };

        vm.selectLayoutType = function (layoutType) {

            vm.layout.data.layout_type = layoutType

        };

        vm.getColumnsCount = function () {

            var result = 10;

            if (vm.layout.data.layout_type) {

                if (vm.layout.data.layout_type === 'desktop') {
                    result = 10;
                }

                if (vm.layout.data.layout_type === 'tablet') {
                    result = 6;
                }

                if (vm.layout.data.layout_type === 'mobile') {
                    result = 4;
                }

            }

            return result;


        };

        vm.getRowsCount = function () {

            var result = 10;

            if (vm.layout.data.layout_type) {

                if (vm.layout.data.layout_type === 'desktop') {
                    result = 20;
                }

                if (vm.layout.data.layout_type === 'tablet') {
                    result = 10;
                }

                if (vm.layout.data.layout_type === 'mobile') {
                    result = 10;
                }

            }

            return result;


        };

        vm.activateTopPanel = function ($event) {

            vm.layout.data.fixed_area.status = 'active';
            vm.layout.data.fixed_area.layout = {
                rows_count: null,
                columns_count: null,
                rows: []
            };

            var columns_count = vm.getColumnsCount();
            var rows_count = 1;

            for (var r = 0; r < rows_count; r = r + 1) {

                vm.layout.data.fixed_area.layout.rows[r] = {
                    row_number: r,
                    columns: []
                };

                for (var c = 0; c < columns_count; c = c + 1) {

                    vm.layout.data.fixed_area.layout.rows[r].columns[c] = {
                        column_number: c,
                        cell_type: 'empty',
                        colspan: 1,
                        rowspan: 1,
                        data: {}
                    }

                }

            }

            vm.layout.data.fixed_area.layout.rows_count = rows_count;
            vm.layout.data.fixed_area.layout.columns_count = columns_count;

            vm.dashboardConstructorEventService.dispatchEvent(dashboardConstructorEvents.UPDATE_DASHBOARD_CONSTRUCTOR)
            setTimeout(function () {
                vm.dashboardConstructorEventService.dispatchEvent(dashboardConstructorEvents.UPDATE_GRID_CELLS_SIZE);
            }, 0)

        };

        vm.deactivateTopPanel = function ($event) {

            $mdDialog.show({
                controller: 'WarningDialogController as vm',
                templateUrl: 'views/warning-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                clickOutsideToClose: false,
                locals: {
                    warning: {
                        title: 'Warning',
                        description: "Are you sure you want to deactivate Top Panel?"
                    }
                },
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                multiple: true
            }).then(function (res) {

                if (res.status === 'agree') {

                    vm.layout.data.fixed_area.status = 'disabled';
                    vm.layout.data.fixed_area.layout = {
                        rows_count: null,
                        columns_count: null,
                        rows: []
                    };

                    vm.dashboardConstructorEventService.dispatchEvent(dashboardConstructorEvents.UPDATE_DASHBOARD_CONSTRUCTOR)

                }
            })

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

            vm.layout.data.tabs = vm.layout.data.tabs.map(function (tab, index) {
                tab.tab_number = index;

                return tab
            });


            vm.dashboardConstructorEventService.dispatchEvent(dashboardConstructorEvents.UPDATE_DASHBOARD_CONSTRUCTOR)

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

            var columns_count = vm.getColumnsCount();
            var rows_count = vm.getRowsCount();

            // console.log('rows_count', rows_count);

            for (var r = 0; r < rows_count; r = r + 1) {

                tab.layout.rows[r] = {
                    row_number: r,
                    columns: []
                };

                for (var c = 0; c < columns_count; c = c + 1) {

                    tab.layout.rows[r].columns[c] = {
                        column_number: c,
                        cell_type: 'empty',
                        colspan: 1,
                        rowspan: 1,
                        data: {}
                    }

                }

            }

            tab.layout.rows_count = rows_count;
            tab.layout.columns_count = columns_count;

            vm.layout.data.tabs.push(tab);

            vm.dashboardConstructorDataService.setData(vm.layout);


            vm.dashboardConstructorEventService.dispatchEvent(dashboardConstructorEvents.UPDATE_DASHBOARD_CONSTRUCTOR);
            setTimeout(function () {
                vm.dashboardConstructorEventService.dispatchEvent(dashboardConstructorEvents.UPDATE_GRID_CELLS_SIZE);

                allowSpacesInTabName();
            }, 100);


        };

        vm.openTabsEditor = function ($event) {

            var tabs = JSON.parse(angular.toJson(vm.layout.data.tabs));

            $mdDialog.show({
                controller: 'TabsEditorDialogController as vm',
                templateUrl: 'views/dialogs/tabs-editor-dialog-view.html',
                multiple: true,
                locals: {
                    tabs: tabs
                }

            }).then(function (res) {

                if (res.status === 'agree') {

                    vm.layout.data.tabs = [];
                    vm.layout.data.tabs = res.data.tabs;

                    vm.dashboardConstructorDataService.setData(vm.layout);
                    vm.dashboardConstructorEventService.dispatchEvent(dashboardConstructorEvents.UPDATE_DASHBOARD_CONSTRUCTOR);

                    vm.dashboardConstructorEventService.dispatchEvent(dashboardConstructorEvents.UPDATE_GRID_CELLS_SIZE);
                }

            });
        };

        var tabNameInput = null;

        var removeKeydownListener = function () {
            document.removeEventListener('keydown', addSpaceIntoTabName);
        };

        var addSpaceIntoTabName = function (kDownEv) {

            if (kDownEv.key === ' ') {

                var selStart = tabNameInput.selectionStart;
                var firstStringPart = tabNameInput.value.substring(0, selStart);
                var selEnd = tabNameInput.selectionEnd;
                var lastStringPart = tabNameInput.value.substring(selEnd, tabNameInput.value.length);
                var tabNewName = firstStringPart + ' ' + lastStringPart;

                tabNameInput.value = tabNewName;
                tabNameInput.selectionEnd = selStart + 1; // set text cursor after added space

                var tabId = tabNameInput.dataset.tabId;
                for (var i = 0; i < vm.layout.data.tabs.length; i++) {
                    if (vm.layout.data.tabs[i].id === tabId) {
                        vm.layout.data.tabs[i].captionName = tabNewName;
                        console.log("space tab tabNewName", tabNewName, vm.layout.data.tabs[i]);
                        break;
                    }
                }
            }

        };

        var allowSpacesInTabName = function () {
            tabNameInput = document.querySelector('input.tabNameInput');

            tabNameInput.addEventListener('focus', function () {
                document.addEventListener('keydown', addSpaceIntoTabName);
                tabNameInput.addEventListener('blur', removeKeydownListener, {once: true});
            });

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

            if (tab.editState) {
                console.log("space tab editTabInit");
                setTimeout(function () {
                    allowSpacesInTabName();
                }, 100);

            }

        };

        vm.saveEditedTab = function (tab) {

            var tabIsReadyToSave = true;
            console.log("tab space tab.captionName", tab.captionName, tab);
            if (tab.captionName && tab.captionName !== '') {

                vm.layout.data.tabs.forEach(function (singleTab) {

                    if (tab.captionName.toLowerCase() === singleTab.name.toLowerCase()) {
                        tabIsReadyToSave = false;
                        console.log("tab space tab with same name", singleTab, singleTab.name);
                    }

                });

                if (tabIsReadyToSave) {
                    tab.name = tab.captionName;
                    tab.editState = !tab.editState;
                }

            } else {
                console.log("tab space empty tab.captionName");
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

            vm.dashboardConstructorEventService.dispatchEvent(dashboardConstructorEvents.UPDATE_GRID_CELLS_SIZE);
        };

        var tabMovementTimeout;

        vm.moveTabToTheLeft = function (tabNumber) {
            var prevTabNumber = tabNumber - 1;

            if (prevTabNumber >= 0) {
                var tabToMove = JSON.parse(angular.toJson(vm.layout.data.tabs[tabNumber]));
                tabToMove.tab_number -= 1;

                vm.layout.data.tabs[tabNumber] = vm.layout.data.tabs[prevTabNumber];
                vm.layout.data.tabs[tabNumber].tab_number += 1;
                vm.layout.data.tabs[prevTabNumber] = tabToMove;
            }

            clearTimeout(tabMovementTimeout);
            tabMovementTimeout = setTimeout(function () {
                vm.dashboardConstructorDataService.setData(vm.layout);
                vm.dashboardConstructorEventService.dispatchEvent(dashboardConstructorEvents.UPDATE_DASHBOARD_CONSTRUCTOR);

                vm.dashboardConstructorEventService.dispatchEvent(dashboardConstructorEvents.UPDATE_GRID_CELLS_SIZE);
            }, 500)
        };

        vm.moveTabToTheRight = function (tabNumber) {
            var nextTabNumber = tabNumber + 1;

            if (vm.layout.data.tabs[nextTabNumber]) {
                var tabToMove = JSON.parse(angular.toJson(vm.layout.data.tabs[tabNumber]));
                tabToMove.tab_number += 1;

                vm.layout.data.tabs[tabNumber] = vm.layout.data.tabs[nextTabNumber];
                vm.layout.data.tabs[tabNumber].tab_number -= 1;
                vm.layout.data.tabs[nextTabNumber] = tabToMove;
            }
        };

        vm.getVerboseType = function (item) {

            var verboseName = 'Unknown';

            switch (item.type) {
                case 'report_viewer':
                    verboseName = 'Report Viewer';
                    break;
                case 'report_viewer_split_panel':
                    verboseName = 'Report Viewer Split Panel';
                    break;
                case 'report_viewer_grand_total':
                    verboseName = 'Report Viewer Grand Total';
                    break;
                case 'report_viewer_bars_chart':
                case 'report_viewer_pie_chart':
                    verboseName = 'Report Viewer Charts';
                    break;
                case 'report_viewer_matrix':
                    verboseName = 'Report Viewer Matrix';
                    break;
                case 'entity_viewer':
                    verboseName = 'Entity Viewer';
                    break;
                case 'entity_viewer_split_panel':
                    verboseName = 'Entity Viewer Split Panel';
                    break;
                case 'input_form':
                    verboseName = 'Input Form';
                    break;
                case 'control':
                    verboseName = 'Control';
                    break;
                case 'button_set':
                    verboseName = 'Button Set';
                    break;
            }

            return verboseName;

        };

        vm.goToDashboard = function () {
            $state.go('app.dashboard')
        };

        var emptySocketInsideTab = function (tabNumber, rowNumber, columnNumber) {

            var dcRow = vm.layout.data.tabs[tabNumber].layout.rows[rowNumber];

            /*var dcColspan = dcRow.columns[columnNumber].colspan;
            var dcRowspan = dcRow.columns[columnNumber].rowspan;

            dcRow.columns[columnNumber] = {
                cell_type: "empty",
                colspan: dcColspan,
                column_number: columnNumber,
                data: {},
                editMode: false,
                rowspan: dcRowspan
            }*/
            dcRow.columns[columnNumber].cell_type = "empty";
            dcRow.columns[columnNumber].colspan = 1;
            dcRow.columns[columnNumber].data = {};
            dcRow.columns[columnNumber].rowspan = 1;

        };

        var emptySocketInsideFixedArea = function (rowNumber, columnNumber) {

            var dcRow = vm.layout.data.fixed_area.layout.rows[rowNumber];

            /*var dcColspan = dcRow.columns[columnNumber].colspan;
            var dcRowspan = dcRow.columns[columnNumber].rowspan;

            dcRow.columns[columnNumber] = {
                cell_type: "empty",
                colspan: dcColspan,
                column_number: columnNumber,
                data: {},
                editMode: false,
                rowspan: dcRowspan
            }*/
            dcRow.columns[columnNumber].cell_type = "empty";
            dcRow.columns[columnNumber].colspan = 1;
            dcRow.columns[columnNumber].data = {};
            dcRow.columns[columnNumber].rowspan = 1;

        };

        var clearSocketSpan = function (tabNumber, rowNumber, rowSpan, colNumber, colSpan) {

            var tab;
            var row;
            var item;

            if (tabNumber === 'fixed_area') {
                tab = vm.layout.data.fixed_area;
            } else {
                tab = vm.layout.data.tabs[tabNumber];
            }

            for (var r = rowNumber; r < rowNumber + rowSpan; r = r + 1) {

                row = tab.layout.rows[r];

                for (var c = colNumber; c < colNumber + colSpan; c = c + 1) {

                    item = row.columns[c];

                    if (item.is_hidden === true) {

                        if (item.hidden_by.row_number === rowNumber &&
                            item.hidden_by.column_number === colNumber) {

                            delete item.is_hidden;
                            delete item.hidden_by;

                        }


                    }

                }

            }

        };

        vm.dragAndDrop = {

            init: function () {
                this.selectDragulaContainers();
                this.eventListeners();
            },

            selectDragulaContainers: function () {
                var items = vm.getDrakeContainers();

                this.dragula = dragula(items,
                    {
                        accepts: function (el, target, source, sibling) {

                            if (target.classList.contains('dashboard-constructor-draggable-card')) {
                                return false;
                            }

                            return true;
                        },
                        copy: true
                    });
            },

            eventListeners: function () {
                var drake = this.dragula;

                drake.on('over', function (elem, container, source) {

                    if (!container.classList.contains('dashboard-constructor-draggable-card')) {
                        $(container).addClass('active');
                        $(container).on('mouseleave', function () {
                            $(this).removeClass('active');
                        })
                    }

                });

                drake.on('out', function (elem, container, source) {
                    $(container).removeClass('active')
                });

                drake.on('drop', function (elem, target) {

                    console.log('target', {target: target});
                    console.log('elem', {elem: elem});
                    var draggedFromSocket = false;

                    $(target).removeClass('active');

                    if (target) {

                        if (target.classList.contains('dashboard-constructor-empty-cell')) {

                            draggedFromSocket = true;

                            var component_id = elem.dataset.componentId;
                            var data_source = target.parentElement.parentElement; // root of the cell (.dashboard-constructor-cell)
                            var tab_number;

                            if (data_source.dataset.tab == 'fixed_area') {
                                tab_number = data_source.dataset.tab;
                            } else {
                                tab_number = parseInt(data_source.dataset.tab, 10);
                            }

                            var row_number = parseInt(data_source.dataset.row, 10);
                            var column_number = parseInt(data_source.dataset.column, 10);

                            if (elem.classList.contains('dashboard-socket-card')) { // when dragged from socket

                                var dc_row_number = parseInt(elem.dataset.row, 10);
                                var dc_column_number = parseInt(elem.dataset.column, 10);
                                var dc_tab_number = elem.dataset.tabNumber;

                                if (dc_tab_number === 'fixed_area') {

                                    var dcTab = vm.layout.data.fixed_area;
                                    var dcRow = dcTab.layout.rows[dc_row_number];
                                    var dcCol = dcRow.columns[dc_column_number];
                                    var deColData = dcCol.data;

                                } else {
                                    dc_tab_number = parseInt(elem.dataset.tabNumber, 10);

                                    var dcTab = vm.layout.data.tabs[dc_tab_number];
                                    var dcRow = dcTab.layout.rows[dc_row_number];
                                    var dcCol = dcRow.columns[dc_column_number];
                                    var deColData = dcCol.data;
                                }

                                var newColData = JSON.parse(JSON.stringify(deColData));

                                if (tab_number === 'fixed_area') {

                                    var targetRow = vm.layout.data.fixed_area.layout.rows[row_number];

                                    /*var targetColspan = targetRow.columns[column_number].colspan;
                                    var targetRowspan = targetRow.columns[column_number].rowspan;*/

                                    targetRow.columns[column_number].cell_type = 'component';
                                    targetRow.columns[column_number].data = newColData;
                                    /*targetRow.columns[column_number].column_number = column_number;
                                    targetRow.columns[column_number].colspan = targetColspan;
                                    targetRow.columns[column_number].rowspan = targetRowspan;*/

                                } else { // when dragged from area with available cards

                                    var targetRow = vm.layout.data.tabs[tab_number].layout.rows[row_number];

                                    /*var targetColspan = targetRow.columns[column_number].colspan;
                                    var targetRowspan = targetRow.columns[column_number].rowspan;*/

                                    targetRow.columns[column_number].cell_type = 'component';
                                    targetRow.columns[column_number].data = newColData;
                                    /*targetRow.columns[column_number].column_number = column_number;
                                    targetRow.columns[column_number].colspan = targetColspan;
                                    targetRow.columns[column_number].rowspan = targetRowspan;*/

                                }

                                var dcRowspan = dcCol.rowspan;
                                var dcColspan = dcCol.colspan;

                                clearSocketSpan(dc_tab_number, dc_row_number, dcRowspan, dc_column_number, dcColspan);

                                if (dc_tab_number === 'fixed_area') {
                                    emptySocketInsideFixedArea(dc_row_number, dc_column_number);
                                } else {
                                    emptySocketInsideTab(dc_tab_number, dc_row_number, dc_column_number);
                                }

                            } else {

                                var component = vm.layout.data.components_types.find(function (item) {
                                    return item.id === component_id
                                });

                                if (tab_number === 'fixed_area') {

                                    var targetRow = vm.layout.data.fixed_area.layout.rows[row_number];

                                    targetRow.columns[column_number].cell_type = 'component';
                                    targetRow.columns[column_number].data = component;

                                } else { // when dragged from area with available cards

                                    var targetRow = vm.layout.data.tabs[tab_number].layout.rows[row_number];

                                    targetRow.columns[column_number].cell_type = 'component';
                                    targetRow.columns[column_number].data = component;

                                }

                            }


                            vm.dashboardConstructorEventService.dispatchEvent(dashboardConstructorEvents.UPDATE_DASHBOARD_CONSTRUCTOR);

                            if (draggedFromSocket) {
                                vm.dashboardConstructorEventService.dispatchEvent(dashboardConstructorEvents.UPDATE_GRID_CELLS_SIZE);
                            }

                            $scope.$apply();

                        }

                    }

                    $scope.$apply();
                });

                drake.on('dragend', function (el) {
                    $scope.$apply();
                    $(el).remove();
                })
            },

            destroy: function () {
                // console.log('this.dragula', this.dragula)
                this.dragula.destroy();
            }
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

            if (vm.dragAndDrop.dragula) {

                setTimeout(function () {

                    vm.dragAndDrop.dragula.containers = [];
                    vm.dragAndDrop.dragula.containers = vm.getDrakeContainers();

                }, 500);

            }

        };

        vm.updateAvailableComponentsTypes = function () {

            var componentsInUse = [];

            if (vm.layout.data.fixed_area.layout && vm.layout.data.fixed_area.layout.rows) {
                vm.layout.data.fixed_area.layout.rows.forEach(function (row) {
                    row.columns.forEach(function (column) {

                        if (column.cell_type === 'component') {
                            componentsInUse.push(column.data.id)
                        }

                    })
                });
            }

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

        vm.isRowAddableFixedArea = function (row) {

            var row_number = row.row_number;

            var result = true;
            var layout_row;
            var item;

            for (var r = 0; r < vm.layout.data.fixed_area.layout.rows.length; r = r + 1) {

                layout_row = vm.layout.data.fixed_area.layout.rows[r];

                if (layout_row.row_number <= row_number) {

                    for (var i = 0; i < layout_row.columns.length; i = i + 1) {

                        item = layout_row.columns[i];

                        if (layout_row.row_number + item.rowspan - 1 > row_number) {

                            result = false;
                            break;

                        }
                    }
                }

                if (!result) {
                    break;
                }

            }

            return result

        };

        vm.isRowAddable = function (tab, row) {

            var row_number = row.row_number;

            var result = true;
            var layout_row;
            var item;

            for (var r = 0; r < tab.layout.rows.length; r = r + 1) {

                layout_row = tab.layout.rows[r];

                if (layout_row.row_number <= row_number) {

                    for (var i = 0; i < layout_row.columns.length; i = i + 1) {

                        item = layout_row.columns[i];

                        if (layout_row.row_number + item.rowspan - 1 > row_number) {

                            result = false;
                            break;

                        }
                    }
                }

                if (!result) {
                    break;
                }

            }

            return result
        };

        vm.isRowEmpty = function (row) {

            var result = true;

            row.columns.forEach(function (column) {

                if (column.cell_type !== 'empty') {
                    result = false;
                }

                if (column.is_hidden === true) {
                    result = false;
                }

            });

            return result

        };

        vm.deleteRowFixedArea = function (row) {

            var layout = vm.dashboardConstructorDataService.getData();

            layout.data.fixed_area.layout.rows = layout.data.fixed_area.layout.rows.filter(function (tabRow) {

                return row.row_number !== tabRow.row_number

            });

            layout.data.fixed_area.layout.rows = layout.data.fixed_area.layout.rows.map(function (row, index) {

                row.row_number = index;

                return row
            });

            layout.data.fixed_area.layout.rows_count = layout.data.fixed_area.layout.rows.length;

            vm.dashboardConstructorDataService.setData(layout);

            vm.dashboardConstructorEventService.dispatchEvent(dashboardConstructorEvents.UPDATE_DASHBOARD_CONSTRUCTOR);
            vm.dashboardConstructorEventService.dispatchEvent(dashboardConstructorEvents.UPDATE_GRID_CELLS_SIZE);


        };

        vm.deleteRow = function (tab, row) {

            var layout = vm.dashboardConstructorDataService.getData();

            layout.data.tabs = layout.data.tabs.map(function (layoutTab) {

                if (tab.id === layoutTab.id) {

                    tab.layout.rows = tab.layout.rows.filter(function (tabRow) {

                        return row.row_number !== tabRow.row_number

                    });

                    tab.layout.rows = tab.layout.rows.map(function (row, index) {

                        row.row_number = index;

                        return row
                    });

                    tab.layout.rows_count = tab.layout.rows.length


                }

                return layoutTab

            });

            vm.dashboardConstructorDataService.setData(layout);

            vm.dashboardConstructorEventService.dispatchEvent(dashboardConstructorEvents.UPDATE_DASHBOARD_CONSTRUCTOR);
            vm.dashboardConstructorEventService.dispatchEvent(dashboardConstructorEvents.UPDATE_GRID_CELLS_SIZE);

        };

        vm.insertRowFixedArea = function (row) {

            var layout = vm.dashboardConstructorDataService.getData();


            var newRow = {
                row_number: row.row_number + 1,
                columns: []
            };

            for (var c = 0; c < layout.data.fixed_area.layout.columns_count; c = c + 1) {

                newRow.columns[c] = {
                    column_number: c,
                    cell_type: 'empty',
                    colspan: 1,
                    rowspan: 1,
                    data: {}
                }
            }

            layout.data.fixed_area.layout.rows.splice(newRow.row_number, 0, newRow);

            layout.data.fixed_area.layout.rows = layout.data.fixed_area.layout.rows.map(function (row, index) {

                row.row_number = index;

                return row
            });

            layout.data.fixed_area.layout.rows_count = layout.data.fixed_area.layout.rows.length;

            vm.dashboardConstructorDataService.setData(layout);

            vm.updateDrakeContainers();
            vm.dashboardConstructorEventService.dispatchEvent(dashboardConstructorEvents.UPDATE_GRID_CELLS_SIZE);

        };

        vm.insertRow = function (tab, row) {

            var layout = vm.dashboardConstructorDataService.getData();

            layout.data.tabs = layout.data.tabs.map(function (layoutTab) {

                if (tab.id === layoutTab.id) {

                    var newRow = {
                        row_number: row.row_number + 1,
                        columns: []
                    };

                    for (var c = 0; c < layoutTab.layout.columns_count; c = c + 1) {

                        newRow.columns[c] = {
                            column_number: c,
                            cell_type: 'empty',
                            colspan: 1,
                            rowspan: 1,
                            data: {}
                        }
                    }

                    layoutTab.layout.rows.splice(newRow.row_number, 0, newRow);

                    layoutTab.layout.rows = layoutTab.layout.rows.map(function (row, index) {

                        row.row_number = index;

                        return row
                    });

                    layoutTab.layout.rows_count = layoutTab.layout.rows.length;

                }

                return layoutTab

            });

            vm.dashboardConstructorDataService.setData(layout);

            vm.updateDrakeContainers();
            vm.dashboardConstructorEventService.dispatchEvent(dashboardConstructorEvents.UPDATE_GRID_CELLS_SIZE);

        };

        vm.getLayout = function () {

            vm.readyStatus.data = false;

            uiService.getDashboardLayoutByKey(vm.layout.id).then(function (data) {

                vm.layout = data;

                vm.dashboardConstructorDataService.setData(vm.layout);

                vm.updateAvailableComponentsTypes();

                vm.readyStatus.data = true;

                vm.dashboardConstructorEventService.dispatchEvent(dashboardConstructorEvents.UPDATE_GRID_CELLS_SIZE);

                console.log('vm.layout', JSON.parse(angular.toJson(vm.layout)));

                $scope.$apply(function () {

                    setTimeout(function () {
                        // vm.initDragAndDrop();
                        vm.dragAndDrop.init();
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

        vm.makeCopy = function ($event) {

            var layout = JSON.parse(JSON.stringify(vm.layout));

            delete layout.id;
            layout.name = layout.name + ' (Copy)';

            uiService.createDashboardLayout(layout).then(function (data) {

                $state.go('app.dashboard-constructor', {
                    id: data.id
                })

            })

        };

        // Components Types Section Start

        vm.addControlComponent = function ($event) {

            $mdDialog.show({
                controller: 'DashboardConstructorControlComponentDialogController as vm',
                templateUrl: 'views/dialogs/dashboard-constructor/dashboard-constructor-control-component-dialog-view.html',
                targetEvent: $event,
                multiple: true,
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                locals: {
                    item: null,
                    dataService: vm.dashboardConstructorDataService,
                    eventService: vm.dashboardConstructorEventService,
                    attributeDataService: vm.attributeDataService
                }
            }).then(function (value) {

                vm.dashboardConstructorEventService.dispatchEvent(dashboardConstructorEvents.UPDATE_DASHBOARD_CONSTRUCTOR)

            })

        };

        vm.addButtonSetComponent = function ($event) {

            $mdDialog.show({
                controller: 'DashboardConstructorButtonSetComponentDialogController as vm',
                templateUrl: 'views/dialogs/dashboard-constructor/dashboard-constructor-button-set-component-dialog-view.html',
                targetEvent: $event,
                multiple: true,
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                locals: {
                    item: null,
                    dataService: vm.dashboardConstructorDataService,
                    eventService: vm.dashboardConstructorEventService,
                    attributeDataService: vm.attributeDataService
                }
            }).then(function (value) {

                vm.dashboardConstructorEventService.dispatchEvent(dashboardConstructorEvents.UPDATE_DASHBOARD_CONSTRUCTOR)

            })

        };

        vm.addInputFormComponent = function ($event) {

            $mdDialog.show({
                controller: 'DashboardConstructorInputFormComponentDialogController as vm',
                templateUrl: 'views/dialogs/dashboard-constructor/dashboard-constructor-input-form-component-dialog-view.html',
                targetEvent: $event,
                multiple: true,
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                locals: {
                    item: null,
                    dataService: vm.dashboardConstructorDataService,
                    eventService: vm.dashboardConstructorEventService,
                    attributeDataService: vm.attributeDataService
                }
            }).then(function (value) {

                vm.dashboardConstructorEventService.dispatchEvent(dashboardConstructorEvents.UPDATE_DASHBOARD_CONSTRUCTOR)

            })

        };

        vm.addReportViewerComponent = function ($event) {

            $mdDialog.show({
                controller: 'DashboardConstructorReportViewerComponentDialogController as vm',
                templateUrl: 'views/dialogs/dashboard-constructor/dashboard-constructor-report-viewer-component-dialog-view.html',
                targetEvent: $event,
                multiple: true,
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                locals: {
                    item: null,
                    dataService: vm.dashboardConstructorDataService,
                    eventService: vm.dashboardConstructorEventService,
                    attributeDataService: vm.attributeDataService
                }
            }).then(function (value) {

                vm.dashboardConstructorEventService.dispatchEvent(dashboardConstructorEvents.UPDATE_DASHBOARD_CONSTRUCTOR)

            })

        };

        vm.addReportViewerSplitPanelComponent = function ($event) {

            $mdDialog.show({
                controller: 'DashboardConstructorReportViewerSplitPanelComponentDialogController as vm',
                templateUrl: 'views/dialogs/dashboard-constructor/dashboard-constructor-report-viewer-split-panel-component-dialog-view.html',
                targetEvent: $event,
                multiple: true,
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                locals: {
                    item: null,
                    dataService: vm.dashboardConstructorDataService,
                    eventService: vm.dashboardConstructorEventService,
                    attributeDataService: vm.attributeDataService
                }
            }).then(function (value) {

                vm.dashboardConstructorEventService.dispatchEvent(dashboardConstructorEvents.UPDATE_DASHBOARD_CONSTRUCTOR)

            })

        };

        vm.addReportViewerGrandTotalComponent = function ($event) {

            $mdDialog.show({
                controller: 'DashboardConstructorReportViewerGrandTotalComponentDialogController as vm',
                templateUrl: 'views/dialogs/dashboard-constructor/dashboard-constructor-report-viewer-grand-total-component-dialog-view.html',
                targetEvent: $event,
                multiple: true,
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                locals: {
                    item: null,
                    dataService: vm.dashboardConstructorDataService,
                    eventService: vm.dashboardConstructorEventService,
                    attributeDataService: vm.attributeDataService
                }
            }).then(function (value) {

                vm.dashboardConstructorEventService.dispatchEvent(dashboardConstructorEvents.UPDATE_DASHBOARD_CONSTRUCTOR)

            })

        };

        vm.addReportViewerMatrixComponent = function ($event) {

            $mdDialog.show({
                controller: 'DashboardConstructorReportViewerMatrixComponentDialogController as vm',
                templateUrl: 'views/dialogs/dashboard-constructor/dashboard-constructor-report-viewer-matrix-component-dialog-view.html',
                targetEvent: $event,
                multiple: true,
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                locals: {
                    item: null,
                    dataService: vm.dashboardConstructorDataService,
                    eventService: vm.dashboardConstructorEventService,
                    attributeDataService: vm.attributeDataService
                }
            }).then(function (value) {

                vm.dashboardConstructorEventService.dispatchEvent(dashboardConstructorEvents.UPDATE_DASHBOARD_CONSTRUCTOR)

            })

        };

        vm.addReportViewerChartsComponent = function ($event) {

            $mdDialog.show({
                controller: 'DashboardConstructorReportViewerChartsComponentDialogController as vm',
                templateUrl: 'views/dialogs/dashboard-constructor/dashboard-constructor-report-viewer-charts-component-dialog-view.html',
                targetEvent: $event,
                multiple: true,
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                locals: {
                    item: null,
                    dataService: vm.dashboardConstructorDataService,
                    eventService: vm.dashboardConstructorEventService,
                    attributeDataService: vm.attributeDataService
                }
            }).then(function (value) {

                vm.dashboardConstructorEventService.dispatchEvent(dashboardConstructorEvents.UPDATE_DASHBOARD_CONSTRUCTOR)

            })

        };

        vm.addEntityViewerComponent = function ($event) {

            $mdDialog.show({
                controller: 'DashboardConstructorEntityViewerComponentDialogController as vm',
                templateUrl: 'views/dialogs/dashboard-constructor/dashboard-constructor-entity-viewer-component-dialog-view.html',
                targetEvent: $event,
                multiple: true,
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                locals: {
                    item: null,
                    dataService: vm.dashboardConstructorDataService,
                    eventService: vm.dashboardConstructorEventService,
                    attributeDataService: vm.attributeDataService
                }
            }).then(function (value) {

                vm.dashboardConstructorEventService.dispatchEvent(dashboardConstructorEvents.UPDATE_DASHBOARD_CONSTRUCTOR)

            })

        };

        vm.addEntityViewerSplitPanelComponent = function ($event) {

            $mdDialog.show({
                controller: 'DashboardConstructorEntityViewerSplitPanelComponentDialogController as vm',
                templateUrl: 'views/dialogs/dashboard-constructor/dashboard-constructor-entity-viewer-split-panel-component-dialog-view.html',
                targetEvent: $event,
                multiple: true,
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                locals: {
                    item: null,
                    dataService: vm.dashboardConstructorDataService,
                    eventService: vm.dashboardConstructorEventService,
                    attributeDataService: vm.attributeDataService
                }
            }).then(function (value) {

                vm.dashboardConstructorEventService.dispatchEvent(dashboardConstructorEvents.UPDATE_DASHBOARD_CONSTRUCTOR)

            })

        };

        /*var openDashboardComponentEditor = function ($event, contrName, templateUrl, locals) {
            $mdDialog.show({
                controller: contrName,
                templateUrl: templateUrl,
                targetEvent: $event,
                multiple: true,
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                locals: {
                    item: JSON.parse(JSON.stringify(item)),
                    dataService: vm.dashboardConstructorDataService,
                    eventService: vm.dashboardConstructorEventService,
                    attributeDataService: vm.attributeDataService
                }
            }).then(function (value) {

                vm.dashboardConstructorEventService.dispatchEvent(dashboardConstructorEvents.UPDATE_DASHBOARD_CONSTRUCTOR)

            })
        };*/

        vm.editComponentType = function ($event, item) {

            var contrName = '';
            var templateUrl = '';

            var locals = {
                item: JSON.parse(JSON.stringify(item)),
                dataService: vm.dashboardConstructorDataService,
                eventService: vm.dashboardConstructorEventService,
                attributeDataService: vm.attributeDataService
            };

            switch (item.type) {
                case 'control':
                    contrName = 'DashboardConstructorControlComponentDialogController as vm';
                    templateUrl = 'views/dialogs/dashboard-constructor/dashboard-constructor-control-component-dialog-view.html';
                    break;
                case 'report_viewer':
                    contrName = 'DashboardConstructorReportViewerComponentDialogController as vm';
                    templateUrl = 'views/dialogs/dashboard-constructor/dashboard-constructor-report-viewer-component-dialog-view.html';
                    break;
                case 'report_viewer_split_panel':
                    contrName = 'DashboardConstructorReportViewerSplitPanelComponentDialogController as vm';
                    templateUrl = 'views/dialogs/dashboard-constructor/dashboard-constructor-report-viewer-split-panel-component-dialog-view.html';
                    break;
                case 'report_viewer_grand_total':
                    contrName = 'DashboardConstructorReportViewerGrandTotalComponentDialogController as vm';
                    templateUrl = 'views/dialogs/dashboard-constructor/dashboard-constructor-report-viewer-grand-total-component-dialog-view.html';
                    break;
                case 'report_viewer_bars_chart':
                case 'report_viewer_pie_chart':
                    contrName = 'DashboardConstructorReportViewerChartsComponentDialogController as vm';
                    templateUrl = 'views/dialogs/dashboard-constructor/dashboard-constructor-report-viewer-charts-component-dialog-view.html';
                    break;
                case 'report_viewer_matrix':
                    contrName = 'DashboardConstructorReportViewerMatrixComponentDialogController as vm';
                    templateUrl = 'views/dialogs/dashboard-constructor/dashboard-constructor-report-viewer-matrix-component-dialog-view.html';
                    break;
                case 'entity_viewer':
                    contrName = 'DashboardConstructorEntityViewerComponentDialogController as vm';
                    templateUrl = 'views/dialogs/dashboard-constructor/dashboard-constructor-entity-viewer-component-dialog-view.html';
                    break;
                case 'entity_viewer_split_panel':
                    contrName = 'DashboardConstructorEntityViewerSplitPanelComponentDialogController as vm';
                    templateUrl = 'views/dialogs/dashboard-constructor/dashboard-constructor-entity-viewer-split-panel-component-dialog-view.html';
                    break;
                case 'button_set':
                    contrName = 'DashboardConstructorButtonSetComponentDialogController as vm';
                    templateUrl = 'views/dialogs/dashboard-constructor/dashboard-constructor-button-set-component-dialog-view.html';
                    break;
                case 'input_form':
                    contrName = 'DashboardConstructorInputFormComponentDialogController as vm';
                    templateUrl = 'views/dialogs/dashboard-constructor/dashboard-constructor-input-form-component-dialog-view.html';
                    break;
            }


            if (contrName && templateUrl) {
                $mdDialog.show({
                    controller: contrName,
                    templateUrl: templateUrl,
                    targetEvent: $event,
                    multiple: true,
                    preserveScope: true,
                    autoWrap: true,
                    skipHide: true,
                    locals: locals
                }).then(function (value) {

                    vm.dashboardConstructorEventService.dispatchEvent(dashboardConstructorEvents.UPDATE_DASHBOARD_CONSTRUCTOR)

                });
            }


        };

        vm.deleteComponentType = function ($event, item) {

            $mdDialog.show({
                controller: 'WarningDialogController as vm',
                templateUrl: 'views/warning-dialog-view.html',
                targetEvent: $event,
                autoWrap: true,
                skipHide: true,
                preserveScope: true,
                multiple: true,
                locals: {
                    warning: {
                        title: 'Warning!',
                        description: 'Are you sure you want to delete Component ' + item.name + '?'
                    }
                }
            }).then(function (res) {

                if (res.status === 'agree') {

                    var componentTypes = vm.dashboardConstructorDataService.getComponentsTypes();

                    componentTypes = componentTypes.filter(function (componentType) {

                        return componentType.id !== item.id

                    });

                    vm.dashboardConstructorDataService.setComponentsTypes(componentTypes);

                    vm.dashboardConstructorEventService.dispatchEvent(dashboardConstructorEvents.UPDATE_DASHBOARD_CONSTRUCTOR)

                }

            })

        };

        // Components Types Section End

        vm.initEventListeners = function () {

            vm.dashboardConstructorEventService.addEventListener(dashboardConstructorEvents.UPDATE_DASHBOARD_CONSTRUCTOR, function () {

                console.log('here?');

                vm.layout = vm.dashboardConstructorDataService.getData();

                vm.updateAvailableComponentsTypes();
                vm.updateDrakeContainers();

            })

        };

        vm.downloadAttributes = function () {

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

            var idAttribute = {
                "key": "id",
                "name": "Id",
                "value_type": 20
            };

            vm.attributeDataService.appendEntityAttribute('portfolio', Object.assign({}, idAttribute));
            vm.attributeDataService.appendEntityAttribute('account', Object.assign({}, idAttribute));
            vm.attributeDataService.appendEntityAttribute('currency', Object.assign({}, idAttribute));
            vm.attributeDataService.appendEntityAttribute('instrument', Object.assign({}, idAttribute));
            vm.attributeDataService.appendEntityAttribute('responsible', Object.assign({}, idAttribute));
            vm.attributeDataService.appendEntityAttribute('counterparty', Object.assign({}, idAttribute));
            vm.attributeDataService.appendEntityAttribute('transaction-type', Object.assign({}, idAttribute));
            vm.attributeDataService.appendEntityAttribute('complex-transaction', Object.assign({}, idAttribute));

            Promise.all(promises).then(function (data) {

                vm.readyStatus.attributes = true;
                $scope.$apply();

            })

        };

        vm.init = function () {

            vm.dashboardConstructorDataService = new DashboardConstructorDataService();
            vm.dashboardConstructorEventService = new DashboardConstructorEventService();

            vm.attributeDataService = new AttributeDataService();

            vm.downloadAttributes();

            vm.initEventListeners();

            if ($stateParams.id && $stateParams.id !== 'new') {

                vm.layout.id = $stateParams.id;

                vm.getLayout();

            } else {

                vm.dashboardConstructorDataService.setData(vm.layout);

                vm.readyStatus.data = true;

                vm.dashboardConstructorEventService.dispatchEvent(dashboardConstructorEvents.UPDATE_GRID_CELLS_SIZE)

                setTimeout(function () {
                    // vm.initDragAndDrop();
                    vm.dragAndDrop.init();
                }, 500);

                console.log('vm.layout', vm.layout)

            }

        };

        vm.init();

        $scope.$on("$destroy", function () {
            vm.dragAndDrop.destroy();
        });

    }

}());