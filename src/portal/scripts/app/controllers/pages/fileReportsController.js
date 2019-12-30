/**
 * Created by mevstratov on 30.12.2019.
 */
(function () {

    'use strict';

    var fileReportsService = require('../../services/fileReportsService');

    module.exports = function ($scope, $mdDialog) {


        var vm = this;

        vm.readyStatus = {content: false};


        vm.getData = function(){

            fileReportsService.getList().then(function (data) {

                vm.items = data.results;

                vm.readyStatus.content = true;

                console.log('vm.items', vm.items);

                $scope.$apply();


            })

        };


        vm.init = function () {

            vm.getData();

        };

        vm.init();


    };

}());