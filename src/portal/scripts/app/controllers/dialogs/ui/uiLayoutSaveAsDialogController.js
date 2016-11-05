/**
 * Created by sergey on 04.11.16.
 */
(function () {

    'use strict';

    var logService = require('../../../../../../core/services/logService');

    module.exports = function ($scope, $mdDialog, options) {

        logService.controller('UiLayoutSaveAsDialogController', 'initialized');

        var vm = this;

        vm.cancel = function () {
            $mdDialog.cancel();
        };

        vm.agree = function () {
            $mdDialog.hide({status: 'agree', data: {name: vm.layoutName}});
        };

    }

}());