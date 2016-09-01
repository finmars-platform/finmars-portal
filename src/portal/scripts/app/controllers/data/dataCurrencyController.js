/**
 * Created by szhitenev on 15.06.2016.
 */
(function () {

    'use strict';

    var currencyService = require('../../services/currencyService');

    module.exports = function ($scope) {

        console.log('{"controller": "DataCurrencyController", status: "initialized"}');

        var vm = this;

        vm.entityType = 'currency';
        vm.entityRaw = [];

        vm.entityViewer = {extraFeatures: []};

        currencyService.getList().then(function (data) {
            vm.entityRaw = data.results;
            $scope.$apply();
        });

        vm.getList = function (options) {
            return currencyService.getList(options).then(function (data) {
                return data.results;
            })
        }

    }

}());