/**
 * Created by szhitenev on 08.06.2016.
 */
(function () {

    'use strict';


    var uiRepository = require('../../repositories/uiRepository');


    module.exports = function ($scope, $mdDialog, data) {

        console.log('data', data);

        var vm = this;

        vm.layout = Object.assign({}, data.layout);

        vm.delete = function () {

            uiRepository.deleteConfigurationExportLayoutByKey(vm.layout.id);

            setTimeout(function () {
                $mdDialog.hide({status: 'agree'});
            }, 100)

        };

        vm.cancel = function () {
            $mdDialog.cancel();
        };

        vm.save = function () {

            if (vm.layout.id) {
                uiRepository.updateConfigurationExportLayout(vm.layout.id, vm.layout).then(function () {
                    $mdDialog.hide({status: 'agree'});
                })
            } else {
                uiRepository.createConfigurationExportLayout(vm.layout).then(function () {
                    $mdDialog.hide({status: 'agree'});
                })
            }


        };

        vm.saveAs = function () {

            delete vm.layout.id;

            uiRepository.createConfigurationExportLayout(vm.layout).then(function () {
                $mdDialog.hide({status: 'agree'});
            })

        };
    }

}());