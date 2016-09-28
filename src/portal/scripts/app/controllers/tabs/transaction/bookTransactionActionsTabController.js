/**
 * Created by szhitenev on 27.09.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../../../core/services/logService');

    module.exports = function ($scope) {
        logService.controller('BookTransactionActionsTabController', 'initialized');

        var vm = this;
        vm.entity = $scope.$parent.vm.entity;
    }

}());