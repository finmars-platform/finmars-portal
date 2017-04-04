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

        vm.isQuotation = false;

        vm.message = {
            quotation: {},
            text: ''
        };

        // var message = '';
        if (options && options.quote) {
            vm.isQuotation = true;
            vm.message.quotation = options.quote.item;


            // console.log('quotation info is ', vm.quotation);
            // var messageObj = {
            //     message: vm.message,
            //     quotation: vm.quotation
            // };
            // var message = JSON.stringify(messageObj);
        }
        // message = vm.message;

        vm.cancel = function () {
            $mdDialog.cancel();
        };

        vm.agree = function () {
            $mdDialog.hide({status: 'agree', data: {message: vm.message}});
        };


    };

}());