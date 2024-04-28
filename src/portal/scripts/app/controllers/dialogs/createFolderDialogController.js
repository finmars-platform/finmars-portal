/**
 * Created by szhitenev on 04.10.2022.
 */
(function () {

    'use strict';

    module.exports = function ($scope, $mdDialog, data) {

        console.log('data', data);

        var vm = this;

        vm.data = data;

        vm.name = vm.data.name;

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.agree = function () {

            vm.data.name = vm.name;

            $mdDialog.hide({status: 'agree', name: vm.name});

        };
    }

}());