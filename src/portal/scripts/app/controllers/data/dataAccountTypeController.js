/**
 * Created by szhitenev on 15.06.2016.
 */
(function () {

    'use strict';

    var accountTypeService = require('../../services/accountTypeService').default;

    module.exports = function ($scope) {

        console.log('{"controller": "DataAccountTypeController", status: "initialized"}');

        var vm = this;

        vm.entityType = 'account-type';
        vm.contentType = 'accounts.accounttype';
        vm.entityRaw = [];

        vm.readyStatus = {content: false};

        vm.entityViewer = {extraFeatures: []};

        // accountTypeService.getList().then(function (data) {
        //     vm.entityRaw = data.results;
        //     vm.readyStatus.content = true;
        //     $scope.$apply();
        // });

        vm.getList = function (options) {
            return accountTypeService.getList(options).then(function (data) {
                return data;
            })
        };

        vm.init = function(){
            vm.readyStatus.content = true
        };

        vm.init()

    }

}());