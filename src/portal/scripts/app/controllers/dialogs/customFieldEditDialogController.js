/**
 * Created by szhitenev on 30.05.2016.
 */
(function () {

    'use strict';

    var customFieldService = require('../../services/reports/customFieldService');

    module.exports = function ($scope, $mdDialog, data) {

        var vm = this;

        vm.entityType = data.entityType;
        vm.customField = data.customField;
        
        vm.agree = function () {

            customFieldService.update(vm.entityType, vm.customField.id, vm.customField).then(function (data) {

                $mdDialog.hide({status: 'agree', data: {attribute: vm.attribute}});

            })
        };

        vm.cancel = function () {
            $mdDialog.cancel();
        };

    }

}());