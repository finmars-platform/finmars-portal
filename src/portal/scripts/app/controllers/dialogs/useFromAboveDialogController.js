/**
 * Created by szhitenev on 08.06.2016.
 */
(function () {

    'use strict';

    module.exports = function ($scope, $mdDialog, item, data) {

        var vm = this;

        vm.item = item;
        vm.data = data;

        console.log('vm.item', vm.item);
        console.log('vm.data', vm.data);


        vm.cancel = function () {
            $mdDialog.cancel();
        };


        vm.agree = function () {

            $mdDialog.hide({status: 'agree', data: {item: vm.item}});

        };

    }

}());