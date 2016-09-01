/**
 * Created by szhitenev on 15.06.2016.
 */
(function () {

    'use strict';

    var instrumentTypeService = require('../../services/instrumentTypeService');

    module.exports = function ($scope) {

        console.log('{"controller": "DataInstrumentTypeController", status: "initialized"}');

        var vm = this;

        vm.entityType = 'instrument-type';
        vm.entityRaw = [];

        vm.entityViewer = {extraFeatures: []};

        instrumentTypeService.getList().then(function (data) {
            vm.entityRaw = data.results;
            $scope.$apply();
        });

        vm.getList = function (options) {
            return instrumentTypeService.getList(options).then(function (data) {
                return data.results;
            })
        }

    }

}());