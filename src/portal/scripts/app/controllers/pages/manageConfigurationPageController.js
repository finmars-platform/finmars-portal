/**
 * Created by szhitenev on 15.04.2023.
 */

(function () {

    'use strict';

    var configurationService = require('../../services/configurationService');
    var marketplaceService = require('../../services/marketplaceService');
    var metaContentTypesService = require('../../services/metaContentTypesService');

    var downloadFileHelper = require('../../helpers/downloadFileHelper');

    var toastNotificationService = require('../../../../../core/services/toastNotificationService');


    module.exports = function manageConfigurationPageController($scope, $state, $stateParams, $mdDialog, usersService) {

        var vm = this;

        vm.items = [];
        vm.readyStatus = {data: false};

        vm.filters = {}

        vm.getData = function () {

            vm.readyStatus.data = false;

            return new Promise(function (resolve, reject) {

                configurationService.getList({
                    pageSize: vm.pageSize,
                    page: vm.currentPage,
                    filters: vm.filters,
                    sort: {
                        direction: "DESC",
                        key: "created"
                    }
                }).then(function (data) {

                    vm.items = data.results;
                    vm.count = data.count;

                    if (vm.items.length) {
                        vm.activeConfiguration = vm.items[0];
                    }


                    vm.readyStatus.data = true;

                    resolve();

                    $scope.$apply();

                })

            })

        };

        vm.editConfiguration = function ($event, item) {

            $mdDialog.show({
                controller: 'ConfigurationDialogController as vm',
                templateUrl: 'views/dialogs/configuration-dialog-view.html',
                locals: {
                    data: {
                        id: item.id
                    }
                },
                targetEvent: $event,
                preserveScope: true,
                multiple: true,
                autoWrap: true,
                skipHide: true
            }).then(function (res) {

                if (res.status === 'agree') {

                    vm.getData();

                }

            });

        }

        vm.createConfiguration = function ($event) {

            $mdDialog.show({
                controller: 'ConfigurationDialogController as vm',
                templateUrl: 'views/dialogs/configuration-dialog-view.html',
                locals: {
                    data: {}
                },
                targetEvent: $event,
                preserveScope: true,
                multiple: true,
                autoWrap: true,
                skipHide: true
            }).then(function (res) {

                if (res.status === 'agree') {

                    vm.getData();

                }

            });

        }

        vm.init = function () {

            console.log('$stateParams', $stateParams);

            if ($stateParams.query) {
                vm.filters.query = $stateParams.query
            }

            vm.getData()

        };

        vm.init();

    };

}());