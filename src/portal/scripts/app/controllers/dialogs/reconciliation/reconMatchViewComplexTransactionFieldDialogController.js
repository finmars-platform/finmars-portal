/**
 * Created by szhitenev on 17.12.2019.
 */
(function () {

    'use strict';

    module.exports = function ($scope, $mdDialog, data) {

        var vm = this;

        vm.item = data.item;
        vm.field = data.field;

        console.log("Complex Transaction line", vm.item);
        console.log("Complex Transaction field", vm.field);


        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.agree = function () {
            $mdDialog.hide({status: 'agree'});
        };

        vm.init = function () {

            console.log("vm", vm);

        };

        vm.init();
    }

}());