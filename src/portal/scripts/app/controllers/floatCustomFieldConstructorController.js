/**
 * Created by szhitenev on 20.02.2017.
 */
(function () {

    'use strict';

    var logService = require('../../../../core/services/logService');

    module.exports = function ($scope) {

        logService.controller('FloatCustomFieldConstructorController', 'initialized');

        var vm = this;

        vm.rangeItems = [
            {
                value_left: -Infinity,
                value_right: Infinity,
                group_name: 'Group 1'
            }
        ]

    }

}());