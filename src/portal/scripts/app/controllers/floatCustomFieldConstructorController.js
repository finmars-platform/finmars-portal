/**
 * Created by szhitenev on 20.02.2017.
 */
(function () {

    'use strict';

    var logService = require('../../../../core/services/logService');

    module.exports = function ($scope) {

        logService.controller('FloatCustomFieldConstructorController', 'initialized');

        var vm = this;

        vm.rangeItems = $scope.$parent.vm.rangeItems;

        if (!vm.rangeItems.length) {
            vm.rangeItems.push({
                value_left: '-inf',
                value_right: 'inf',
                group_name: 'Group 1'
            });
        }

        $scope.$parent.vm.rangeType = 20;

    }

}());