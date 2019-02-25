/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../core/services/logService');
    var uiService = require('../services/uiService');
    var metaContentTypesService = require('../services/metaContentTypesService');

    module.exports = function ($scope, $mdDialog) {
        logService.controller('DashboardController', 'initialized');

        var vm = this;

        vm.readyStatus = {uiLayouts: false, entityListLayout: false};
        vm.entityType = 'dashboard';

        vm.oldListView = null;
        vm.listView = null;

        vm.getUiLayouts = function () {

            uiService.getListLayout('all').then(function (data) {

                vm.uiLayouts = data.results.map(function (item) {
                    if (item.content_type !== 'ui.dashboard') {
                        return item;
                    }
                }).filter(function (item) {
                    return !!item
                });

                vm.readyStatus.uiLayouts = true;

                vm.getView();

            });
        };

        vm.getUiLayouts();

        vm.resolveEntity = function (item) {
            return metaContentTypesService.findEntityByContentType(item.content_type, 'ui').split('-').join(' ').capitalizeFirstLetter();
        };

        vm.closeWidget = function (widget) {
            widget._d_configured = false;
            widget.uiLayoutId = null;
            widget.entityType = null;
            widget._d_layout = null;
            widget.isReport = false;
        };

        vm.changeWidget = function (widget) {
            widget.entityType = metaContentTypesService.findEntityByContentType(widget._d_layout.content_type, 'ui');
            widget.uiLayoutId = widget._d_layout.id;
            widget._d_configured = true;

            if (widget.entityType.indexOf('-report') !== -1) {
                widget.isReport = true;
            } else {
                widget.isReport = false;
            }


            console.log('widget', widget);

        };



        vm.getView = function () {

            vm.readyStatus.entityListLayout = false;

            uiService.getActiveListLayout(vm.entityType).then(function (data) {

                if (data.results.length) {

                    vm.listView = data.results[0];

                    vm.oldListView = JSON.parse(JSON.stringify(vm.listView));

                    vm.widget1 = vm.listView.data.widget1;
                    vm.widget2 = vm.listView.data.widget2;
                    vm.widget3 = vm.listView.data.widget3;
                    vm.widget4 = vm.listView.data.widget4;


                    vm.uiLayouts.forEach(function (uiLayout) {

                        if(uiLayout.id == vm.widget1.uiLayoutId) {
                            vm.widget1._d_layout = uiLayout;
                        }

                        if(uiLayout.id == vm.widget2.uiLayoutId) {
                            vm.widget2._d_layout = uiLayout;
                        }

                        if(uiLayout.id == vm.widget3.uiLayoutId) {
                            vm.widget3._d_layout = uiLayout;
                        }

                        if(uiLayout.id == vm.widget4.uiLayoutId) {
                            vm.widget4._d_layout = uiLayout;
                        }

                    })


                } else {

                    // defaults

                    vm.widget1 = {
                        entityType: 'balance-report',
                        entityRaw: [],
                        isReport: true,
                        entityViewer: {extraFeatures: []},
                        _d_configured: true,
                        components: {
                            sidebar: false,
                            groupingArea: false,
                            columnAreaHeader: false,
                            splitPanel: false,
                            addEntityBtn: false,
                            fieldManagerBtn: false,
                            layoutManager: false,
                            autoReportRequest: true
                        }
                    };

                    vm.widget2 = {
                        entityType: 'instrument',
                        entityRaw: [],
                        isReport: false,
                        entityViewer: {extraFeatures: []},
                        _d_configured: true,
                        components: {
                            sidebar: false,
                            groupingArea: false,
                            columnAreaHeader: false,
                            splitPanel: false,
                            addEntityBtn: false,
                            fieldManagerBtn: false,
                            layoutManager: false,
                            autoReportRequest: true
                        }
                    };

                    vm.widget3 = {
                        entityType: 'portfolio',
                        entityRaw: [],
                        isReport: false,
                        entityViewer: {extraFeatures: []},
                        _d_configured: true,
                        components: {
                            sidebar: false,
                            groupingArea: false,
                            columnAreaHeader: false,
                            splitPanel: false,
                            addEntityBtn: false,
                            fieldManagerBtn: false,
                            layoutManager: false,
                            autoReportRequest: true
                        }
                    };

                    vm.widget4 = {
                        entityType: 'account',
                        entityRaw: [],
                        isReport: false,
                        entityViewer: {extraFeatures: []},
                        _d_configured: true,
                        components: {
                            sidebar: false,
                            groupingArea: false,
                            columnAreaHeader: false,
                            splitPanel: false,
                            addEntityBtn: false,
                            fieldManagerBtn: false,
                            layoutManager: false,
                            autoReportRequest: true
                        }
                    };
                }

                vm.readyStatus.entityListLayout = true;

                vm.bindLayoutManager();

                $scope.$apply();
            })
        };


        vm.bindLayoutManager = function () {

            $('.save-layout-as-btn').bind('click', function (e) {

                $mdDialog.show({
                    controller: 'UiLayoutSaveAsDialogController as vm',
                    templateUrl: 'views/dialogs/ui/ui-layout-save-as-view.html',
                    parent: angular.element(document.body),
                    targetEvent: e,
                    locals: {
                        options: {}
                    },
                    clickOutsideToClose: false
                }).then(function (res) {

                    if (!vm.listView) {
                        vm.listView = {data: {}};
                    }

                    vm.listView.data.widget1 = vm.widget1;
                    vm.listView.data.widget2 = vm.widget2;
                    vm.listView.data.widget3 = vm.widget3;
                    vm.listView.data.widget4 = vm.widget4;

                    if (res.status == 'agree') {

                        if (vm.oldListView) {
                            vm.oldListView.is_default = false;

                            uiService.updateListLayout(vm.oldListView.id, vm.oldListView).then(function () {
                                //console.log('saved');
                            }).then(function () {

                                vm.listView.name = res.data.name;
                                vm.listView.is_default = true;

                                uiService.createListLayout(vm.entityType, vm.listView).then(function () {
                                    //console.log('saved');
                                    vm.getView();
                                });

                            })

                        } else {

                            vm.listView.name = res.data.name;
                            vm.listView.is_default = true;

                            uiService.createListLayout(vm.entityType, vm.listView).then(function () {
                                //console.log('saved');
                                vm.getView();
                            });
                        }
                    }

                });

            });

            $('.save-layout-btn').bind('click', function (e) {

                if (!vm.listView) {
                    vm.listView = {name: 'Default', data: {}};
                }

                vm.listView.data.widget1 = vm.widget1;
                vm.listView.data.widget2 = vm.widget2;
                vm.listView.data.widget3 = vm.widget3;
                vm.listView.data.widget4 = vm.widget4;

                if (vm.listView.hasOwnProperty('id')) {
                    uiService.updateListLayout(vm.listView.id, vm.listView).then(function () {
                        //console.log('saved');
                    });
                } else {
                    uiService.createListLayout(vm.entityType, vm.listView).then(function () {
                        //console.log('saved');
                    });
                }
                $mdDialog.show({
                    controller: 'SaveLayoutDialogController as vm',
                    templateUrl: 'views/save-layout-dialog-view.html',
                    targetEvent: e,
                    clickOutsideToClose: false
                }).then(function () {
                    vm.getView();
                });


            });

        };

        $scope.$on("$destroy", function (event) {

            $('.save-layout-btn').unbind('click');
            $('.save-layout-as-btn').unbind('click');

            logService.controller('DashboardController', 'destroyed');

        });
    }

}());