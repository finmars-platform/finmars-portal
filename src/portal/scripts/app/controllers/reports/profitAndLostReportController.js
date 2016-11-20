/**
 * Created by szhitenev on 01.11.2016.
 */
(function(){

    'use strict';

    var instrumentService = require('../../services/instrumentService'); // TODO change to balance report service

    module.exports = function($scope){

        console.log('{"controller": "ProfitAndLostReportController", status: "initialized"}');

        var vm = this;

        vm.entityType = 'instrument';
        vm.entityRaw = [];

        vm.readyStatus = {content: false};

        vm.isReport = true;

        vm.entityViewer = {extraFeatures: []};

        instrumentService.getList().then(function (data) {
            vm.entityRaw = data.results;
            vm.readyStatus.content = true;
            $scope.$apply();
        });

        vm.getList = function (options) {
            return instrumentService.getList(options).then(function (data) {
                return data;
            })
        }

    }

}());