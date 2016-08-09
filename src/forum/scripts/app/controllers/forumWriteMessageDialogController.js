/**
 * Created by sergey on 30.07.16.
 */
(function () {

    'use strict';

    var logService = require('../../../../core/services/logService');

    module.exports = function ($scope, $mdDialog, options) {

        logService.controller('WriteMessageDialogController', 'initialized');

        var vm = this;

        console.log('options---------------------', options);

        if(options && options.quote) {
            vm.message = options.quote.item.text;
        }

        vm.cancel = function () {
            $mdDialog.cancel();
        };

        vm.agree = function () {
            $mdDialog.hide({status: 'agree', data: {message: vm.message}});
        };

    };

}());