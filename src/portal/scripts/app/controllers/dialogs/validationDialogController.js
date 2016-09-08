/**
 * Created by szhitenev on 08.06.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');

    module.exports = function ($scope, $mdDialog, validationData) {

        logService.controller('ValidationDialogController', 'initialized');

        var vm = this;

        vm.validationData = validationData;

        vm.errorKeys = [];

        function removeUnderscores(key) {

            var result = '';

            result = key.replace('_', ' ');

            return result.charAt(0).toUpperCase() + result.slice(1);

        }

        var i;
        var keys = Object.keys(vm.validationData);

        for (i = 0; i < keys.length; i = i + 1) {
            vm.errorKeys.push({caption: removeUnderscores(keys[i]), value: vm.validationData[keys[i]][0]});
        }


        vm.cancel = function () {
            $mdDialog.cancel();
        };

        vm.agree = function () {
            $mdDialog.hide({status: 'agree'});
        };
    }

}());