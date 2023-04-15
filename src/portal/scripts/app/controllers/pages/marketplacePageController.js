/**
 * Created by szhitenev on 15.04.2023.
 */
(function () {

    'use strict';

    var historyService = require('../../services/historyService');
    var marketplaceService = require('../../services/marketplaceService');
    var metaContentTypesService = require('../../services/metaContentTypesService');


    module.exports = function marketplacePageController($scope, $state, $stateParams, $mdDialog, usersService) {

        var vm = this;

        vm.items = [];
        vm.readyStatus = {data: false};

        vm.filters = {}


        vm.getData = function () {

            vm.readyStatus.data = false;

            return new Promise(function (resolve, reject) {

                marketplaceService.getList({
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


                    vm.readyStatus.data = true;

                    resolve();

                    $scope.$apply();

                })

            })

        };

        vm.installConfiguration = function ($event, item){

            console.log("Install configuration", item);

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