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
                components_types: []
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

            var columns_count = 10;
            var rows_count = 10;

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


            vm.dashboardConstructorEventService.dispatchEvent(dashboardConstructorEvents.UPDATE_DASHBOARD_CONSTRUCTOR)
            setTimeout(function () {
                vm.dashboardConstructorEventService.dispatchEvent(dashboardConstructorEvents.UPDATE_GRID_CELLS_SIZE);
            }, 0)
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

            vm.dashboardConstructorEventService.dispatchEvent(dashboardConstructorEvents.UPDATE_GRID_CELLS_SIZE);
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
                case 'report_viewer_charts':
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

                                vm.dashboardConstructorEventService.dispatchEvent(dashboardConstructorEvents.UPDATE_DASHBOARD_CONSTRUCTOR)

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

            vm.dashboardConstructorEventService.dispatchEvent(dashboardConstructorEvents.UPDATE_DASHBOARD_CONSTRUCTOR)
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

                vm.dashboardConstructorEventService.dispatchEvent(dashboardConstructorEvents.UPDATE_GRID_CELLS_SIZE)

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
                    eventService: vm.dashboardConstructorEventService
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

        var openDashboardComponentEditor = function ($event, contrName, templateUrl, locals) {
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
        };

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
                case 'report_viewer_charts':
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
            };

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
            };

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

        vm.init = function () {

            vm.dashboardConstructorDataService = new DashboardConstructorDataService();
            vm.dashboardConstructorEventService = new DashboardConstructorEventService();

            vm.attributeDataService = new AttributeDataService();

            vm.initEventListeners();

            if ($stateParams.id && $stateParams.id !== 'new') {

                vm.layout.id = $stateParams.id;

                vm.getLayout();

            } else {

                vm.dashboardConstructorDataService.setData(vm.layout);

                vm.readyStatus.data = true;

                vm.dashboardConstructorEventService.dispatchEvent(dashboardConstructorEvents.UPDATE_GRID_CELLS_SIZE)

                setTimeout(function () {
                    vm.initDragAndDrop();
                }, 500);

                console.log('vm.layout', vm.layout)


            }


        };

        vm.init();

    }

}());