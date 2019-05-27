/**
 * Created by szhitenev on 01.11.2016.
 */
(function(){

    'use strict';

    var reportService = require('../../services/reportService');

    module.exports = function($scope){

        console.log('{"controller": "ProfitAndLostReportController", status: "initialized"}');

        var vm = this;

        vm.entityType = 'pl-report';
        vm.entityRaw = [];

        vm.readyStatus = {content: false};

        vm.isReport = true;

        vm.entityViewer = {extraFeatures: []};

        vm.readyStatus.content = true;

        //reportService.getList().then(function (data) {
        //    vm.entityRaw = data.results;
        //    vm.readyStatus.content = true;
        //    $scope.$apply();
        //});

        vm.getList = function (options) {
            return reportService.getList(options).then(function (data) {
                return data;
            })
        }

    }

}());