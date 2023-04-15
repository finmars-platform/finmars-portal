/**
 * Created by szhitenev on 15.04.2023.
 */
(function () {

    'use strict';

    var configurationService = require('../../services/configurationService');
    var marketplaceService = require('../../services/marketplaceService');
    var metaContentTypesService = require('../../services/metaContentTypesService');

    var downloadFileHelper = require('../../helpers/downloadFileHelper');


    module.exports = function manageConfigurationPageController($scope, $state, $stateParams, $mdDialog, usersService) {

        var vm = this;

        vm.items = [];
        vm.readyStatus = {data: false};

        vm.filters = {}

        vm.activeConfiguration = null;

        vm.setActivConfiguration = function ($event, item) {
            vm.activeConfiguration = item;
        }


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

        vm.exportConfiguration = function () {

            configurationService.exportConfiguration(vm.activeConfiguration.id).then(function (data) {

                downloadFileHelper.downloadFile(data, "application/zip", vm.activeConfiguration.name + '.zip');

            })

        };

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