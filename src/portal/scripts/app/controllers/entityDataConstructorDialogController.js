/**
 * Created by szhitenev on 30.05.2016.
 */
(function () {

    'use strict';

    var logService = require('../services/logService');

    module.exports = function ($scope, $mdDialog, parentScope) {

        logService.controller('EntityDataConstructorDialogController', 'initialized');

        var vm = this;
        vm.tabs = parentScope.vm.tabs;


    }

}());