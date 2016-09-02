/**
 * Created by szhitenev on 30.05.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');

    var metaService = require('../../services/metaService');

    module.exports = function ($scope, $mdDialog, attribute) {

        logService.controller('AttributesAddDialogManagerController', 'initialized');

        var vm = this;
        vm.attribute = JSON.parse(JSON.stringify(attribute));

        vm.editRestriction = true;

        console.log('vm.attribute', vm.attribute);

        vm.valueTypes = metaService.getDynamicAttrsValueTypesCaptions();

        vm.agree = function(){
            console.log('vm.attr', vm.attribute);
            $mdDialog.hide({status: 'agree', data: {attribute: vm.attribute}});
        };

        vm.cancel = function () {
            $mdDialog.cancel();
        };

    }

}());