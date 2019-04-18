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

        var stringHelper = require('../../helpers/stringHelper');

        var evDataProviderService = require('../../services/ev-data-provider/ev-data-provider.service');

        var entityViewerReducer = require('./entityViewerReducer');

        module.exports = function ($scope, $mdDialog, $transitions) {

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
                    var reportLayoutOptions = entityViewerDataService.getReportLayoutOptions();
                    var newReportOptions = Object.assign({}, reportOptions, listLayout.data.reportOptions);
                    var newReportLayoutOptions = Object.assign({}, reportLayoutOptions, listLayout.data.reportLayoutOptions);

                    entityViewerDataService.setReportOptions(newReportOptions);
                    entityViewerDataService.setReportLayoutOptions(newReportLayoutOptions);

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

            var checkLayoutForChanges = function (transition) {
                var stateName = transition.to().name;
                var listOfStatesWithLayout = [
                    'app.data.portfolio',
                    'app.data.account',
                    'app.data.account-type',
                    'app.data.counterparty',
                    'app.data.responsible',
                    'app.data.instrument',
                    'app.data.instrument-type',
                    'app.data.pricing-policy',
                    'app.data.complex-transaction',
                    'app.data.transaction',
                    'app.data.transaction-type',
                    'app.data.currency-history',
                    'app.data.price-history',
                    'app.data.currency',
                    'app.data.strategy-group',
                    'app.data.strategy'
                ];

                console.log("layout warning transition data", transition, stateName);
                if (listOfStatesWithLayout.indexOf(stateName) !== -1) {

                    var th = $('.g-columns-component.g-thead').find('.g-cell');
                    var thWidths = [];
                    for (var i = 0; i < th.length; i++) {
                        var thWidth = $(th[i]).width();
                        thWidths.push(thWidth);
                    }

                    var activeLayout = JSON.stringify(entityViewerDataService.getListLayout());
                    var layoutCurrentConfiguration = JSON.stringify(entityViewerDataService.getLayoutCurrentConfiguration(thWidths, false));
                    console.log("layout warning layouts", JSON.stringify(activeLayout) + '\n' + JSON.stringify(layoutCurrentConfiguration));

                    var activeLayoutHash = stringHelper.toHash(activeLayout);
                    var layoutCurrentConfigurationHash = stringHelper.toHash(layoutCurrentConfiguration);

                    console.log("layout warning hashes", activeLayoutHash + '\n' + layoutCurrentConfigurationHash);

                    if (activeLayoutHash !== layoutCurrentConfigurationHash) {

                        return new Promise (function (resolve, reject) {

                            $mdDialog.show({
                                controller: 'WarningDialogController as vm',
                                templateUrl: 'views/warning-dialog-view.html',
                                parent: angular.element(document.body),
                                preserveScope: true,
                                autoWrap: true,
                                multiple: true,
                                skipHide: true,
                                locals: {
                                    warning: {
                                        title: 'Warning',
                                        description: 'If you leave this page all unsaved layout changes will be lost. Do you want to proceed.'
                                    }
                                }
                            }).then(function (res, rej) {

                                if (res.status === 'agree') {
                                    resolve(true);
                                }
                            }).catch(function () {
                                reject();
                            });
                        });

                    } else {
                        console.log('layout warning layout is not modified');
                    }
                } else {
                    console.log('layout warning without layout');
                }

            };

            // var doBeforeStateChange = $transitions.onBefore({}, checkLayoutForChanges);


            this.$onDestroy = function () {
                // doBeforeStateChange();
                console.log("layout warning destroyed");
            }
        }

    }()
);