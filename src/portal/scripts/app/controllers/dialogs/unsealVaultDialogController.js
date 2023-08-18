/**
 * Created by szhitenev on 25.06.2023.
 */
(function () {

    'use strict';

    module.exports = function ($scope, $mdDialog, data) {

        console.log('data', data);

        var vm = this;


        vm.key = '';

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.agree = function () {

            $mdDialog.hide({status: 'agree', data: {key: vm.key}});

        };
    }

}());