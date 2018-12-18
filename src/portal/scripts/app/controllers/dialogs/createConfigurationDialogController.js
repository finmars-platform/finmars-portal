/**
 * Created by szhitenev on 08.06.2016.
 */
(function () {

    'use strict';

    var uiService = require('../../services/uiService');

    module.exports = function ($scope, $mdDialog) {

        var vm = this;

        vm.cancel = function () {
            $mdDialog.cancel();
        };

        vm.configurationFileIsAvailable = function () {
            return vm.file !== null && vm.file !== undefined
        };

        vm.agree = function () {

            var reader = new FileReader();

            reader.readAsText(vm.file);

            reader.onload = function (evt) {

                try {

                    var file = JSON.parse(evt.target.result);

                    uiService.createConfiguration(
                        {
                            name: vm.item.name,
                            description: vm.item.description,
                            data: file
                        }
                    ).then(function (value) {

                        $mdDialog.hide({status: 'agree'});

                    });

                } catch (e) {
                    vm.error = true;
                }
            };


        };
    }

}());