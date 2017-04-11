/**
 * Created by szhitenev on 08.06.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');

    module.exports = function ($scope, $mdDialog, data) {

        logService.controller('HelpDialogController', 'initialized');

        var vm = this;

        vm.data = data;

        vm.baseUrl = 'https://finmars.com/portal/help/';

        vm.helpPage = vm.baseUrl + 'index.html';

        if (vm.data.helpPageUrl) {
            vm.helpPage = vm.baseUrl + vm.data.helpPageUrl;
        }

        vm.cancel = function () {
            $mdDialog.cancel();
        };

        vm.agree = function () {
            $mdDialog.hide({status: 'agree'});
        };
    }

}());