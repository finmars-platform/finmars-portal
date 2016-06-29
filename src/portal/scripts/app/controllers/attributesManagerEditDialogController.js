/**
 * Created by szhitenev on 30.05.2016.
 */
(function () {

    'use strict';

    var logService = require('../services/logService');

    var metaService = require('../services/metaService');

    module.exports = function ($scope, $mdDialog, attribute) {

        logService.controller('AttributesAddDialogManagerController', 'initialized');

        var vm = this;
        vm.attribute = JSON.parse(JSON.stringify(attribute));

        vm.editRestriction = true;

        console.log('vm.attribute', vm.attribute);

        vm.valueTypes = metaService.getValueTypes().filter(function(item){
            return item.value !== 30 && item.value !== 'decoration';
        });

        vm.valueTypes = vm.valueTypes.map(function (item) {

            switch (item['display_name']){
                case 'Number':
                    item['caption_name'] = 'Integer';
                    break;
                case 'Float':
                    item['caption_name'] = 'Number with decimals';
                    break;
                case 'Field':
                    item['caption_name'] = 'Classification';
                    break;
                default:
                    item['caption_name'] = item['display_name'];
                    break;
            }

            return item;
        });

        vm.agree = function(){
            console.log('vm.attr', vm.attribute);
            $mdDialog.hide({status: 'agree', data: {attribute: vm.attribute}});
        };

        vm.cancel = function () {
            $mdDialog.cancel();
        };

    }

}());