/**
 * Created by szhitenev on 08.06.2016.
 */
(function () {

    'use strict';

    module.exports = function ($scope, $mdDialog, data) {

        console.log('data', data);

        var vm = this;

        vm.disabled = true;
        vm.smallOptions = {
            noIndicatorBtn: true
        };

        vm.smallOptions2 = Object.assign({readonly: true}, vm.smallOptions)

        vm.data = data;
        vm.title = data.title || 'Rename';

        vm.layout_name = vm.data.layout_name;

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.agree = function () {

            vm.data.layout_name = vm.layout_name;

            $mdDialog.hide({status: 'agree', data: vm.data});
        };
    }

}());