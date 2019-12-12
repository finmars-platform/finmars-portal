/**
 * Created by szhitenev on 09.12.2019.
 */
(function () {

    'use strict';

    module.exports = function ($scope, $mdDialog, data) {

        var vm = this;

        vm.scheme = data.scheme;

        vm.deleteSelector = function($event, $index) {
            vm.scheme.selector_values.splice($index, 1);
        };

        vm.addSelector = function ($event) {
            vm.scheme.selector_values.push({
               value: '',
               notes: ''
            });
        };

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.agree = function ($event) {

            $mdDialog.hide({status: 'agree'});

        };


        vm.init = function () {


        };

        vm.init();
    }

}());