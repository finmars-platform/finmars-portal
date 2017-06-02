/**
 * Created by szhitenev on 20.02.2017.
 */
(function () {

    'use strict';

    var logService = require('../../../../core/services/logService');

    module.exports = function ($scope) {

        logService.controller('DateCustomFieldConstructorController', 'initialized');

        var vm = this;

        vm.rangeItems = $scope.$parent.vm.rangeItems;
        vm.dateRange = $scope.$parent.vm.dateRange;

        $scope.$parent.vm.rangeType = 40;

        if (!vm.rangeItems) {
            vm.rangeItems = [];
        }

        if (!vm.rangeItems.length) {
            vm.rangeItems.push({});
        }

    }

}());