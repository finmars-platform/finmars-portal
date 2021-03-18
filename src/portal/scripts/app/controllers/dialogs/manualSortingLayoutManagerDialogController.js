(function () {

    'use strict';

    var uiService = require('../../services/uiService')

    module.exports = function ($scope, $mdDialog, data, entityViewerDataService) {

        var vm = this;

        vm.column = data.column;

        vm.columnLayouts = [];
        vm.commonLayouts = [];

        vm.readyStatus = {columnLayouts: false, commonLayouts: false};

        vm.agree = function ($event) {

            $mdDialog.hide({status: 'agree'});

        };

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };


        vm.getColumnLayouts = function (){

            vm.readyStatus.columnLayouts = false;

            uiService.getColumnSortDataList({
                filters: {
                    is_common: false,
                    column_key: vm.column.key
                }
            }).then(function (data){

                if (data.results.length) {

                    vm.columnLayouts = data.results

                }

                vm.readyStatus.columnLayouts = true;

                $scope.$apply();


            })

        }

        vm.getCommonLayouts = function (){

            vm.readyStatus.commonLayouts = false;

            uiService.getColumnSortDataList({
                filters: {
                    is_common: true
                }
            }).then(function (data){

                if (data.results.length) {

                    vm.commonLayouts = data.results

                }

                vm.readyStatus.commonLayouts = true;

                $scope.$apply();


            })

        }

        vm.editManualSortingLayout = function ($event, item) {

            $mdDialog.show({
                controller: 'ManualSortingSettingsDialogController as vm',
                templateUrl: 'views/dialogs/manual-sorting-settings-dialog-view.html',
                targetEvent: $event,
                multiple: true,
                locals: {
                    data: {
                        column: vm.column,
                        item: item
                    },
                    entityViewerDataService: entityViewerDataService
                }

            }).then(function (res) {

                if (res.status === 'agree') {

                    $mdDialog.hide({status: 'agree'});

                }

            });

        }

        vm.deleteManualSortingLayout = function ($event, item) {

            $mdDialog.show({
                controller: 'WarningDialogController as vm',
                templateUrl: 'views/dialogs/warning-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: activeObject.event,
                preserveScope: true,
                autoWrap: true,
                multiple: true,
                skipHide: true,
                locals: {
                    warning: {
                        title: 'Warning',
                        description: 'Are you sure you want to delete manual sorting layout?'
                    }
                }

            }).then(function (res) {

                if (res.status === 'agree') {

                    uiService.deleteEditLayoutByKey(item.id).then(function (data) {

                        vm.getColumnLayouts();
                        vm.getCommonLayouts();


                    })

                }

            })

        }

        vm.createManualSortingLayout = function ($event) {

            $mdDialog.show({
                controller: 'ManualSortingSettingsDialogController as vm',
                templateUrl: 'views/dialogs/manual-sorting-settings-dialog-view.html',
                targetEvent: $event,
                multiple: true,
                locals: {
                    data: {
                        column: vm.column
                    },
                    entityViewerDataService: entityViewerDataService
                }

            }).then(function (res) {

                if (res.status === 'agree') {

                    $mdDialog.hide({status: 'agree'});

                }

            });

        }

        vm.applyManualSortingLayout = function ($event, item) {

            vm.column.manual_sort_layout_user_code = item.user_code

        }

        vm.clearManualSortingLayout = function ($event, item) {
            vm.column.manual_sort_layout_user_code = null;
        }

        vm.init = function () {

            vm.getColumnLayouts();
            vm.getCommonLayouts();

        };

        vm.init();

    }
}());