(function () {

    'use strict';

    module.exports = function ($scope, $mdDialog) {

    	var vm = this;

        vm.cancel = function () {
            $mdDialog.cancel();
        };

    }

}());