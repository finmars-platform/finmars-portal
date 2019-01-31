/**
 * Created by mevstratov on 30.01.2019.
 */
(function() {

    'use strict';

    module.exports = function ($scope, $mdDialog) {

        var vm = this;

        vm.agree = function () {
            $mdDialog.hide({status: 'agree'});
        };

        vm.cancel = function () {
            $mdDialog.cancel();
        };
    }

}());