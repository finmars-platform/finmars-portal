/**
 * Created by szhitenev on 08.06.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');

    module.exports = function ($scope, $mdDialog, data) {

        logService.controller('LoaderDialogController', 'initialized');

        var vm = this;

        console.log('data', data);

        vm.data = data;

        var interval = setInterval(function () {

            var callbackData = vm.data.callback();

            vm.data.current = callbackData.current || 0;
            vm.data.total = callbackData.total;
            vm.data.status = callbackData.status;

            if (vm.data.status === 'SUCCESS') {

                clearInterval(interval);
                $mdDialog.hide();

            } else {

                $scope.$apply();

            }

        }, 100);

        vm.cancel = function () {
            $mdDialog.hide();
        };

        $scope.$on("$destroy", function (event) {

            clearInterval(interval)

        });

    }

}());