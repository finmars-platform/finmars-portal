/**
 * Created by mevstratov on 30.12.2019.
 */
(function () {

    'use strict';

    var fileReportsService = require('../../services/fileReportsService');

    var baseUrlService = require('../../services/baseUrlService');

    var baseUrl = baseUrlService.resolve();


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

        vm.getFileUrl = function(item) {

            return baseUrl + 'file-reports/file-report/' + item.id + '/view/';

        };


        vm.init = function () {

            vm.getData();

        };

        vm.init();


    };

}());