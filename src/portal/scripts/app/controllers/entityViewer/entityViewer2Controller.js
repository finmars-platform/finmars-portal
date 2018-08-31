/**
 /**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

        'use strict';

        var uiService = require('../../services/uiService');
        var evEvents = require('../../services/entityViewerEvents');


        var EntityViewerDataService = require('../../services/entityViewerDataService');
        var EntityViewerEventService = require('../../services/entityViewerEventService');

        var evDataProviderService = require('../../services/ev-data-provider/ev-data-provider.service');

        var entityViewerReducer = require('./entityViewerReducer');

        module.exports = function ($scope, $mdDialog) {

            var vm = this;

            vm.listViewIsReady = false;

            var entityViewerDataService = new EntityViewerDataService();
            var entityViewerEventService = new EntityViewerEventService();

            vm.entityViewerDataService = entityViewerDataService;
            vm.entityViewerEventService = entityViewerEventService;

            vm.getView = function () {

                uiService.getActiveListLayout(vm.entityType).then(function (res) {

                    var listLayout = {};

                    if (res.results.length) {

                        listLayout = Object.assign({}, res.results[0]);

                    } else {

                        console.log('default triggered');

                        var defaultList = uiService.getDefaultListLayout();

                        listLayout = {};
                        listLayout.data = Object.assign({}, defaultList[0].data);

                    }

                    entityViewerDataService.setListLayout(listLayout);


                    var reportOptions = entityViewerDataService.getReportOptions();
                    var newReportOptions = Object.assign({}, reportOptions, listLayout.data.reportOptions);

                    entityViewerDataService.setReportOptions(newReportOptions);

                    entityViewerDataService.setColumns(listLayout.data.columns);
                    entityViewerDataService.setGroups(listLayout.data.grouping);
                    entityViewerDataService.setFilters(listLayout.data.filters);

                    listLayout.data.components = {
                        sidebar: true,
                        groupingArea: true,
                        columnAreaHeader: true,
                        splitPanel: true,
                        addEntityBtn: true,
                        fieldManagerBtn: true,
                        layoutManager: true,
                        autoReportRequest: false
                    };

                    entityViewerDataService.setComponents(listLayout.data.components);
                    entityViewerDataService.setEditorTemplateUrl('views/additions-editor-view.html');
                    entityViewerDataService.setRootEntityViewer(true);

                    vm.listViewIsReady = true;

                    console.log('vm', vm);

                    evDataProviderService.updateDataStructure(entityViewerDataService, entityViewerEventService);

                    $scope.$apply()

                });

            };

            vm.init = function () {

                vm.entityType = $scope.$parent.vm.entityType;
                entityViewerDataService.setEntityType($scope.$parent.vm.entityType);

                vm.getView();

                entityViewerReducer.initReducer(entityViewerDataService, entityViewerEventService, $mdDialog, vm.getView);


            };

            vm.init();
        }

    }()
);