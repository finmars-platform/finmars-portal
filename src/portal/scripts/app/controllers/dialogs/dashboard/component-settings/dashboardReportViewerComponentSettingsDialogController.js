(function () {

    'use strict';

    module.exports = function ($scope, $mdDialog, item) {

        var vm = this;

        vm.item = JSON.parse(JSON.stringify(item));

        if (!vm.item.user_settings) {
            vm.item.user_settings = {};
        }

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.agree = function () {
            $mdDialog.hide({status: 'agree', data: {item: vm.item}});
        };

        // getAttributes();
    }

}());