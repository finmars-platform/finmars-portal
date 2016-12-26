/**
 * Created by szhitenev on 01.11.2016.
 */
(function(){

    'use strict';

    //var instrumentService = require('../../services/instrumentService'); // TODO change to balance report service
    var reportService = require('../../services/reportService');

    module.exports = function($scope){

        console.log('{"controller": "TransactionReportController", status: "initialized"}');

        var vm = this;

        vm.entityType = 'transaction-report';
        vm.entityRaw = [];

        vm.isReport = true;

        vm.readyStatus = {content: false};

        vm.entityViewer = {extraFeatures: []};

        vm.readyStatus.content = true;

        //reportService.getList().then(function (data) {
        //    vm.entityRaw = data.items;
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