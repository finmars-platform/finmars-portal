/**
 * Created by mevstratov on 21.02.2019.
 */
(function () {

    'use strict';

    module.exports = function ($scope, $mdDialog) {

        var vm = this;

        vm.cancel = function () {
            $mdDialog.cancel();
        };

    };
}());